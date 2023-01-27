import mongoose from 'mongoose'
const Schema = mongoose.Schema

const user = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: [true, 'This email already exists.']
    },
    passwordDigest: { type: String, required: true },
    phoneNumber: {
      type: String,
      match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$|^\d{10}$/
    },
    profilePhoto: { type: String },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default mongoose.model('User', user)
