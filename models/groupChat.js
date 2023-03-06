import mongoose from 'mongoose'
const Schema = mongoose.Schema

const groupChat = new Schema(
  {
    groupName: { type: String, required: true },
    groupDescription: { type: String, default: 'Group' },
    groupPhoto: { type: String },
    participants: [
      {
        participant: { type: mongoose.Types.ObjectId, ref: 'User' },
        isAdmin: { type: Boolean, default: false, required: true }
      }
    ],
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
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
    media: [{ type: mongoose.Types.ObjectId, ref: 'Media' }],
    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

groupChat.index({ groupName: 1, 'participants._id': 1 }, { unique: true })

export default mongoose.model('GroupChat', groupChat)
