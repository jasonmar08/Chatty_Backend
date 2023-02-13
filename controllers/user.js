import User from '../models/user.js'
import PrivateChat from '../models/privateChat.js'
import GroupChat from '../models/groupChat.js'

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select('firstName, lastName, email')
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
    const privateThreads = await PrivateChat.find({
      participants: { $elemMatch: { $eq: userId } }
    })
    const groupThreads = await GroupChat.find({
      participants: { $elemMatch: { $eq: userId } }
    })

    const allThreads = privateThreads.concat(groupThreads)
    await filterChatThreads(allThreads)
    res.status(200).json({
      allThreads,
      message: `Successfully retrieved all chat threads for user with ID ${userId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const filterChatThreads = async (threads) => {
  threads.sort((a, b) => {
    return new Date(b.lastActive) - new Date(a.lastActive)
  })
}
