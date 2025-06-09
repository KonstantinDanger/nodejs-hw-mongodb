import { SORT_ORDER } from '../constants.js';
import { ContactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) {
  const offset = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  const contacts = await contactsQuery
    .skip(offset)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  return {
    data: contacts,
    ...paginationData,
  };
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
