import User from '../models/user.js'
import {
  hashPassword,
  comparePassword,
  createToken
} from '../middleware/jwtAuth.js'

export const register = async (req, res) => {
  try {
    let { firstName, lastName, email, password, phoneNumber, profilePhoto } =
      req.body
    let passwordDigest = await hashPassword(password)
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordDigest,
      profilePhoto
    })
    await newUser.save()
    // let securedUser = Object.assign({}, newUser._doc, {passwordDigest: undefined})
    res.status(201).json({
      message: `Hi, ${firstName}! Your account has been successfully created.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email = email.toLowerCase(), password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && (await comparePassword(user.passwordDigest, password))) {
      let payload = {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        profilePhoto: user.profilePhoto
      }
      let token = createToken(payload)
      return res.status(201).json({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', message: 'Unauthorized' })
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ error: error.message })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    if (
      user &&
      (await comparePassword(user.passwordDigest, req.body.oldPassword))
    ) {
      let passwordDigest = await hashPassword(req.body.newPassword)
      await user.findByIdAndUpdate(userId, { passwordDigest }, { new: true })
      return res.status(201).json({
        status: 'Success',
        message: 'Your password has been successfully updated.'
      })
    }
    res
      .status(401)
      .json({ status: 'Error', message: 'Old password is incorrect.' })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
}

export const checkSession = async (req, res) => {
  console.log(res.locals.payload)
  const { payload } = res.locals
  res.send(payload)
}
