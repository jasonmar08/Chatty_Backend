import mongoose from 'mongoose'
const Schema = mongoose.Schema

const privateChat = new Schema(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        validate: {
          validator: (participants) => participants.length === 2,
          message: 'A private chat must have exactly 2 participants.'
        }
      }
    ],
    typingUsers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    messages: [
      {
        text: { type: String },
        sender: { type: mongoose.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['sent', 'read', 'failed'],
          default: 'sent'
        },
        readBy: [
          {
            user: { type: mongoose.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now }
          }
        ]
      }
    ],
    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

privateChat.index({ participants: 1 })

export default mongoose.model('PrivateChat', privateChat)
