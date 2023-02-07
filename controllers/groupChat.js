import mongoose from 'mongoose'
import GroupChat from '../models/groupChat.js'

export const createGroupChat = async (req, res) => {
  try {
    const { userId } = req.params
    let { groupName, groupDescription, groupPhoto, participants } = req.body
    const newGroupChat = new GroupChat({
      groupName,
      groupDescription,
      groupPhoto,
      participants: [
        { _id: mongoose.Types.ObjectId(userId), isAdmin: true },
        ...participants
      ],
      creator: mongoose.Types.ObjectId(userId)
    })
    await newGroupChat.save()
    res.status(201).json({
      message: `Group chat created successfully by user with ID ${userId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const createGroupChatMessage = async (req, res) => {
  try {
    const { userId, groupChatId } = req.params
    let { text } = req.body
    const existingGroupChat = await GroupChat.findOne({ _id: groupChatId })

    existingGroupChat['messages'].push({
      text: text,
      sender: mongoose.Types.ObjectId(userId)
    })
    await existingGroupChat.save()
    res.status(201).json({
      message: `Successfully sent message from user with ID ${userId} to group chat ${groupChatId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getAllGroupChatThreads = async (req, res) => {
  try {
    const { userId } = req.params
    const groupChatThreads = await find({
      participants: { $elemMatch: { $eq: userId } }
    })

    if (groupChatThreads.length === 0) {
      return res.status(404).json({
        message: `No group chat threads found for user with ID ${userId}.`
      })
    }
    res.status(200).json({
      groupChatThreads,
      message: `Successfully retrieved all group chat threads for user with ID ${userId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateGroupChatInfo = async (req, res) => {
  try {
    const { userId, groupChatId } = req.params
    const groupChat = await GroupChat.findOne({ _id: groupChatId }).populate(
      'participants'
    )

    const user = groupChat.participants.find(
      (user) => user._id.toString() === userId
    )

    if (user && user.isAdmin === true) {
      const updatedData = Object.assign({}, req.body)
      const updatedGroupChat = await GroupChat.findByIdAndUpdate(
        { _id: groupChatId },
        updatedData,
        { new: true }
      )

      if (!updatedGroupChat) {
        return res
          .status(404)
          .json({ message: `Group chat with ID ${groupChatId} not updated.` })
      }
      return res.status(201).json({
        message: `Group chat with ID ${groupChatId} successfully updated.`
      })
    }
    return res.status(403).json({
      message: `User does not have admin privileges to update group chat.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteGroupChatThread = async (req, res) => {
  try {
    const { userId, groupChatId } = req.params
    const groupChat = await GroupChat.findOne({ _id: groupChatId })
    if (!groupChat)
      return res
        .status(404)
        .json({
          message: `Could not find group chat thread with ID ${groupChatId}.`
        })

    const user = groupChat.participants.find(
      (user) => user._id.toString() === userId
    )
    if (!user)
      return res
        .status(403)
        .json({ message: `User is not a participant of the group chat.` })

    if (user._id !== groupChat.creator)
      return res
        .status(403)
        .json({
          message: `User is not the creator of the group chat and cannot delete the thread.`
        })

    const deletedGroupChatThread = await GroupChat.findByIdAndDelete(
      groupChatId
    )
    if (!deletedGroupChatThread)
      return res
        .status(404)
        .json({
          message: `Could not delete group chat thread with ID ${groupChatId}.`
        })

    return res
      .status(200)
      .json({
        message: `Successfully deleted group chat thread with ID ${groupChatId}.`
      })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const leaveGroupChat = async (req, res) => {
  try {
    const { userId, groupChatId } = req.params
    const removedUser = await GroupChat.findByIdAndUpdate(
      { _id: groupChatId },
      { $pull: { participants: { _id: userId } } },
      { new: true }
    )

    if (!removedUser) {
      return res
        .status(404)
        .json({ message: `Group chat with ID ${groupChatId} not found.` })
    }
    res.status(200).json({
      message: `User with ID ${userId} successfully left the group chat ${groupChatId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}
