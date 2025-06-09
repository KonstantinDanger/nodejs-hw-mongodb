import { CONTACT_TYPES } from '../constants.js';

const parseContactType = (type) => {
  if (typeof type !== 'string') {
    return;
  }

  const isTypeValid = CONTACT_TYPES.includes(type);

  if (isTypeValid) {
    return type;
  }
};

const parseBool = (value) => {
  if (typeof value !== 'string') {
    return;
  }

  return value;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseBool(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
