import { ContactsCollection } from '../models/contact.js';

export async function getAllContacts() {
  const contacts = await ContactsCollection.find();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await ContactsCollection.findById(contactId);

  if (!contact) {
    return null;
  }

  return contact;
}

export async function createContact(payload) {
  const contact = await ContactsCollection.create(payload);
  return contact;
}

export async function updateContact(contacId, payload, options = {}) {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contacId,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResult?.value) {
    return null;
  }

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}

export async function deleteContact(contactId) {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  if (!contact) {
    return null;
  }

  return contact;
}
