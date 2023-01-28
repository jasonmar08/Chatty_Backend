import mongoose from 'mongoose'
const Schema = mongoose.Schema

const contactDirectory = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    contact: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: '' },
      email: {
        type: String,
        match: /.+\@.+\..+/,
        unique: true,
        index: true,
        required: true
      },
      phoneNumber: {
        type: String,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$|^\d{10}$/
      },
      isFavorite: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
)

export default mongoose.model('ContactDirectory', contactDirectory)
