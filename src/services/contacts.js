import createHttpError from 'http-errors';
import { SORT_ORDER } from '../constants.js';
import { ContactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export async function getAllContacts({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) {
  const offset = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find()
    .where('userId')
    .equals(userId);

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  const contactsCount = await ContactsCollection.find()
    .where('userId')
    .equals(userId)
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

export async function getContactById(contactId, userId) {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });

  if (!contact) {
    return null;
  }

  return contact;
}

export async function createContact(payload, userId) {
  const contact = await ContactsCollection.create({ ...payload, userId });
  return contact;
}

export async function updateContact(contactId, userId, payload, options = {}) {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId: userId,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResult?.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}

export async function deleteContact(contactId, userId) {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });

  if (!contact) {
    return null;
  }

  return contact;
}
