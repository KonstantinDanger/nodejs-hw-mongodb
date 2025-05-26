import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export async function getAllContactsController(req, res) {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const contact = await getContactById(req.params.contactId);

  res.status(200).json({
    status: 200,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
}

export async function patchContactController(req, res, next) {
  const { contactId } = req.params;
  const payload = req.body;
  const data = await updateContact(contactId, payload);

  res.status(200).json({
    status: 200,
    message: 'Sccessfully patched a contact',
    data: data.contact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
}
