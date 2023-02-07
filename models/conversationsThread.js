import mongoose from 'mongoose'
const Schema = mongoose.Schema

const conversationsThread = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    messageThreads: [
      {
        type: { type: String, enum: ['PrivateChat', 'GroupChat'] },
        chat: { type: mongoose.Types.ObjectId, refPath: 'messageThreads.type' }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('ConversationsThread', conversationsThread)
