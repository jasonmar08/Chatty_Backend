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
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && comparePassword(user.passwordDigest, password)) {
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
