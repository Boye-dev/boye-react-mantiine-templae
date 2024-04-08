export type IQueryParams = {
  [key: string]: string | number | boolean | null | string[] | undefined;
};

export const queryParamsHelper = (queryParams?: IQueryParams): string => {
  const validParams: string[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(queryParams || {})) {
    if (key && value !== undefined && value !== null && value !== '') {
      if (key === 'page') {
        validParams.push(`page=${Number(value) + 1}`);
      } else if (Array.isArray(value)) {
        const arrayToString = value.toString().replaceAll(',', `&${key}=`);
        if (arrayToString.length > 0) {
          validParams.push(`${key}=${arrayToString}`);
        }
      } else {
        validParams.push(`${key}=${value}`);
      }
    }
  }

  if (validParams.length === 0) {
    return '';
  }

  return `?${validParams.join('&')}`;
};
