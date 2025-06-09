const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';

  if (!isString) {
    return defaultValue;
  }

  const parsedNumber = Number.parseInt(number);

  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const currentPage = parseNumber(page, 1);
  const itemsPerPage = parseNumber(perPage, 10);

  return {
    page: currentPage,
    perPage: itemsPerPage,
  };
};

export const calculatePaginationData = (contactsCount, page, perPage) => {
  const totalPages = Math.ceil(contactsCount / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: contactsCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export default parsePaginationParams;
