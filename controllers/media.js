import Media from '../models/media.js'

export const createMediaMessage = async (req, res) => {
  try {
    const { userId, privateChatId, groupChatId } = req.params
    const { fileName, fileType, fileSize, fileUrl } = req.body
    const mediaMessage = new Media({
      userId,
      privateChatId,
      groupChatId,
      fileName,
      fileType,
      fileSize,
      fileUrl
    })
    await mediaMessage.save()
    res.status(200).json({
      mediaMessage,
      message: `Successfully created ${fileType} media message by user ${userId}.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getAllMedia = async (req, res) => {
  try {
    const allMedia = await Media.find({})
    allMedia.length === 0
      ? res.status(404).json({ message: 'No media found in the database.' })
      : res.status(200).json({
          allMedia,
          message: 'Successfully retrieved all media from database.'
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getMediaByChatId = async (req, res) => {
  try {
    const { privateChatId, groupChatId } = req.params
    if (privateChatId) {
      const mediaMessages = await Media.find({ privateChatId })
      mediaMessages.length === 0
        ? res.status(404).json({
            message: `No media messages found for private chat with ID ${privateChatId}.`
          })
        : res.status(200).json({
            mediaMessages,
            message: `Successfully retrieved media messages for private chat with ID ${privateChatId}.`
          })
    }

    if (groupChatId) {
      const mediaMessages = await Media.find({ groupChatId })
      mediaMessages.length === 0
        ? res.status(404).json({
            message: `No media messages found for group chat with ID ${groupChatId}.`
          })
        : res.status(200).json({
            mediaMessages,
            message: `Successfully retrieved media messages for group chat with ID ${groupChatId}.`
          })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getMediaByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const mediaMessages = await Media.find({ userId })
    mediaMessages.length === 0
      ? res.status(404).json({
          message: `No media messages found for user with ID ${userId}.`
        })
      : res.status(200).json({
          mediaMessages,
          message: `Successfully found media messages for user with ID ${userId}.`
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getChatMediaByFileType = async (req, res) => {
  try {
    const { privateChatId, groupChatId } = req.params
    const { fileType } = req.query

    if (privateChatId) {
      const mediaMessages = await Media.find({ privateChatId, fileType })
      !mediaMessages || mediaMessages.length === 0
        ? res.status(404).json({
            message: `No ${fileType} media found for private chat with ID ${privateChatId}.`
          })
        : res.status(200).json({
            mediaMessages,
            message: `Successfully retrieved ${fileType} media messages for private chat with ID ${privateChatId}.`
          })
    }

    if (groupChatId) {
      const mediaMessages = await Media.find({ groupChatId, fileType })
      !mediaMessages || mediaMessages.length === 0
        ? res.status(404).json({
            message: `No ${fileType} media found for group chat with ID ${groupChatId}.`
          })
        : res.status(200).json({
            mediaMessages,
            message: `Successfully retrieved ${fileType} media messages for group chat with ID ${groupChatId}.`
          })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}
