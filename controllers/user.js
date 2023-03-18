import mongoose from 'mongoose'
import User from '../models/user.js'
import PrivateChat from '../models/privateChat.js'
import GroupChat from '../models/groupChat.js'

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select(
      'firstName lastName email profilePhoto'
    )
    res
      .status(200)
      .json(
        allUsers.length > 0
          ? allUsers
          : { message: 'There are currently no users.' }
      )
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getOneUserById = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select(
      '-passwordDigest, -verified'
    )
    res
      .status(200)
      .json(user ? user : { message: `User with ID ${userId} not found.` })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params
    console.log('User req.body:', req.body)
    await User.findByIdAndUpdate(userId, req.body, {
      new: true
    }).select('-passwordDigest, -verified')
    res
      .status(200)
      .json({ message: `User with ID ${userId} successfully updated.` })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const deletedUser = await User.findByIdAndDelete(userId)
    res.status(200).json(
      deletedUser
        ? {
            deletionStatus: true,
            message: `User with ID ${userId} successfully deleted from database.`
          }
        : {
            deletionStatus: false,
            message: `User with ID ${userId} not found.`
          }
    )
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ deletionStatus: false, error: error.message })
  }
}

export const getAllChatThreads = async (req, res) => {
  try {
    const { userId } = req.params

    // Fetch all private threads
    const privateThreads = await PrivateChat.find({
      participants: { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } }
    })
      .select('_id participants lastActive')
      .populate({
        path: 'participants',
        select: 'email firstName lastName profilePhoto'
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'email firstName lastName profilePhoto'
        }
      })
      .populate({
        path: 'media',
        populate: {
          path: 'sender',
          select: 'email firstName lastName profilePhoto'
        }
      })

    // Combine private chats text and media messages, and extract last message from each thread
    const privateThreadsLastMessage = privateThreads.map((thread) => {
      const messages = thread.messages?.concat(thread.media) || []
      messages.sort(
        (a, b) =>
          new Date(b.createdAt || b.timestamp) -
          new Date(a.createdAt || a.timestamp)
      )
      const lastMessage = messages[0]
      return {
        ...thread.toObject(),
        messages: undefined,
        media: undefined,
        lastMessage
      }
    })

    // Fetch all group threads
    const groupThreads = await GroupChat.find({
      participants: { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } }
    })
      .select('_id participants lastActive groupName groupPhoto')
      .populate({
        path: 'participants.participant',
        select: 'email firstName lastName profilePhoto'
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'email firstName lastName profilePhoto'
        }
      })
      .populate({
        path: 'media',
        populate: {
          path: 'sender',
          select: 'email firstName lastName profilePhoto'
        }
      })

    // Combine group chats text and media messages, and extract last message from each thread
    const groupThreadsLastMessage = groupThreads.map((thread) => {
      const messages = thread.messages?.concat(thread.media) || []
      messages.sort(
        (a, b) =>
          new Date(b.createdAt || b.timestamp) -
          new Date(a.createdAt || a.timestamp)
      )
      const lastMessage = messages[0]
      return {
        ...thread.toObject(),
        messages: undefined,
        media: undefined,
        lastMessage
      }
    })

    // Combine private and group threads, and sort by lastActive
    const combinedThreads = privateThreadsLastMessage.concat(
      groupThreadsLastMessage
    )
    combinedThreads.sort((a, b) => {
      return new Date(b.lastActive) - new Date(a.lastActive)
    })

    combinedThreads.length === 0
      ? res.status(404).json({
          message: `No conversation threads found for user with ID ${userId}.`
        })
      : res.status(200).json({
          combinedThreads,
          message: `Successfully retrieved all chat threads for user with ID ${userId}.`
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}
