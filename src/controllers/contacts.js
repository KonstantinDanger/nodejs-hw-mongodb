import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { parseSortingParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import getEnvVar from '../utils/getEnvVar.js';
import { ENABLE_CLOUDINARY } from '../constants.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export async function getContactsController(req, res, next) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortingParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  if (contacts.data.length === 0) {
    next(createHttpError(404, 'Contacts not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Contacts found',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Contact with id '${contactId}' found`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const photo = req.file;

  const photoUrl = await trySavePhoto(photo);

  const payload = { ...req.body, photo: photoUrl };

  const contact = await createContact(payload, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
}

export async function patchContactController(req, res, next) {
  const { contactId } = req.params;
  const photo = req.file;

  const photoUrl = await trySavePhoto(photo);

  const payload = { ...req.body, photo: photoUrl };

  const data = await updateContact(contactId, req.user._id, { ...payload });

  res.status(200).json({
    status: 200,
    message: 'Sccessfully patched a contact',
    data: data.contact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
}

const trySavePhoto = async (photo) => {
  if (!photo) {
    return null;
  }
  let photoUrl;

  if (getEnvVar(ENABLE_CLOUDINARY) === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  return photoUrl;
};
