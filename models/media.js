import mongoose from 'mongoose'
const Schema = mongoose.Schema

const media = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    privateChatId: {
      type: mongoose.Types.ObjectId,
      ref: 'PrivateChat'
    },
    groupChatId: {
      type: mongoose.Types.ObjectId,
      ref: 'GroupChat'
    },
    validate: {
      validator: (mediaMessage) => {
        return (
          (mediaMessage.privateChatId && !mediaMessage.groupChatId) ||
          (mediaMessage.groupChatId && !mediaMessage.privateChatId)
        )
      },
      message:
        'Media message must be associated with either a private chat or a group chat, but not both.'
    },
    fileName: { type: String },
    fileType: {
      type: String,
      enum: ['image', 'video', 'audio'],
      default: 'image'
    },
    fileSize: { type: String },
    fileUrl: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Media', media)
