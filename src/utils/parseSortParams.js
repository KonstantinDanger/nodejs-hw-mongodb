import { KEYS_OF_CONTACT, SORT_ORDER } from '../constants.js';

const parseSortOrder = (sortOrder) => {
  const isOrderValid = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

  if (!isOrderValid) {
    return SORT_ORDER.ASC;
  }

  return sortOrder;
};

const parseSortBy = (sortBy) => {
  if (KEYS_OF_CONTACT.includes(sortBy)) {
    return sortBy;
  }

  return KEYS_OF_CONTACT['_id'];
};

export const parseSortingParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
