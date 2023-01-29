import User from '../models/user.js'

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
