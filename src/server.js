import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getEnvVar from './utils/getEnvVar.js';

import { pinoHttp } from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer(params) {
  const app = express();
  app.use(cors({ allowedHeaders: '*' }));
  app.use(express.json());
  app.use(pinoHttp({ transport: { target: 'pino-pretty' } }));

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({
      message: 'Successfully found contact by ID',
      data: contact,
    });
  });

  app.use('{/*any}', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
    });
  });

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}
