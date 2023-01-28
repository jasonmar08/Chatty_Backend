import mongoose from 'mongoose'
const Schema = mongoose.Schema

const contactDirectory = new Schema(
  [
    {
      contactFirstName: { type: String, required: true },
      contactLastName: { type: String, default: '' },
      contactEmail: {
        type: String,
        default: '',
        match: /.+\@.+\..+/,
        unique: true,
        index: true,
        required: true
      },
      contactPhoneNumber: {
        type: String,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$|^\d{10}$/
      },
      isFavorite: { type: Boolean, default: false }
    }
  ],
  { timestamps: true }
)

export default mongoose.model('ContactDirectory', contactDirectory)
