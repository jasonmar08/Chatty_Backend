import ContactDirectory from '../models/contactDirectory.js'
import User from '../models/user.js'

export const getAllContacts = async (req, res) => {
  try {
    const allContacts = await ContactDirectory.find({})

    allContacts.length === 0
      ? res
          .status(404)
          .json({ message: 'No stored contacts found in the entire database.' })
      : res.status(200).json({
          allContacts,
          message: 'Successfully retrieved all contacts from database.'
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getAllContactsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const userContacts = await ContactDirectory.find({ userId }).populate({
      path: 'contacts.contactId',
      select: '_id email'
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
    await existingContactDirectory.save()
    res.status(201).json({
      message: `Contact added successfully! ${firstName} ${lastName} was added to your contacts list.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getOneContact = async (req, res) => {
  try {
    const { userId, contactId } = req.params
    const contact = await ContactDirectory.findOne(
      { userId, 'contacts._id': contactId }, // query filter
      { 'contacts.$': 1 } // returns only specified contact
    )

    if (!contact) {
      return res
        .status(404)
        .json({ message: `Contact with ID ${contactId} not found.` })
    }

    res.status(200).json({
      contact: contact.contacts[0],
      message: `Contact with ID ${contactId} successfully found.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateContact = async (req, res) => {
  try {
    const { userId, contactId } = req.params
    const updatedContactValues = { ...req.body }
    const updatedDirectory = await ContactDirectory.findByIdAndUpdate(
      { userId, 'contacts._id': contactId }, // query filter
      { $set: { 'contacts.$': updatedContactValues } }, // update expression
      { new: true } // returns updated doc, not original doc
    )

    if (!updatedDirectory) {
      return res
        .status(404)
        .json({ message: `Contact with ID ${contactId} not found.` })
    }

    const updatedContact = updatedDirectory.contacts.find(
      (contact) => contact._id.toString() === contactId
    )

    return res.status(200).json({
      updatedContact,
      message: `Contact with ID ${contactId} successfully updated.`
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteOneContact = async (req, res) => {
  try {
    const { userId, contactId } = req.params
    const deletedContact = await ContactDirectory.findOneAndUpdate(
      { userId },
      { $pull: { contacts: { _id: contactId } } },
      { new: true }
    )

    if (!deletedContact) {
      return res
        .status(404)
        .json({ message: `Contact with ID ${contactId} not found.` })
    }
    res
      .status(200)
      .json({ message: `Contact with ID ${contactId} successfully deleted.` })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      error: error.message,
      message: `An error occurred while deleting contact with ID ${contactId}.`
    })
  }
}

export const getAllFavoriteContacts = async (req, res) => {
  try {
    const { userId } = req.params
    const favoriteContacts = await ContactDirectory.find({
      userId,
      'contacts.isFavorite': true
    })

    favoriteContacts.length === 0
      ? res.status(404).json({
          message: `User with ID ${userId} has no favorite contacts.`
        })
      : res.status(200).json({
          favoriteContacts,
          message: `Successfully retrieved all favorited contacts for user with ID ${userId}.`
        })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}
