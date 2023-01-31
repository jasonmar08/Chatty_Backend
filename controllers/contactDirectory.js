import ContactDirectory from '../models/contactDirectory.js'
import User from '../models/user.js'

export const getAllContactsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const userContacts = await ContactDirectory.find({ userId }).populate({
      path: 'contacts.contactId',
      select: '-passwordDigest -verified'
    })
    userContacts.length === 0
      ? res
          .status(404)
          .json({ message: `User with ID ${userId} has no contacts.` })
      : res.status(200).json({
          userContacts,
          message: `Found all contacts for user with ID ${userId} successfully.`
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const createNewContact = async (req, res) => {
  try {
    const { userId } = req.params
    let { firstName, lastName, email, phoneNumber } = req.body
    const existingContactDirectory = await ContactDirectory.findOne({ userId })
    const existingUser = await User.findOne({ email }).select('_id')

    if (!existingUser) {
      return res.status(404).json({
        message: `User not found. The email address ${email} doesn't belong to any registered Chatty user. You can invite them to join Chatty and add them as a contact.`
      })
    }

    if (!existingContactDirectory && existingUser) {
      const newContactDirectory = new ContactDirectory({
        userId: userId
      })
      newContactDirectory['contacts'].push({
        contactId: existingUser._id,
        firstName,
        lastName,
        email: email,
        phoneNumber
      })
      await newContactDirectory.save()
      return res.status(201).json({
        message: `Contact added successfully! ${firstName} ${lastName} was added to your contacts list.`
      })
    }

    existingContactDirectory['contacts'].push({
      contactId: existingUser._id,
      firstName,
      lastName,
      email: email,
      phoneNumber
    })
    res.status(201).json({
      message: `Contact added successfully! ${firstName} ${lastName} was added to your contacts list.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}
