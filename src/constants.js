import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const KEYS_OF_CONTACT = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

export const CONTACT_TYPES = ['work', 'home', 'personal'];
export const FIFTEEN_MINUTES = 1000 * 60 * 15;
export const ONE_DAY = 1000 * 60 * 60 * 24;

export const SESSION_ID_COOKIE_KEY = 'sessionId';
export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const JWT_SECRET = 'JWT_SECRET';
export const APP_DOMAIN = 'APP_DOMAIN';
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
