export const convertAllLowercaseToSentenceCase = (value: string) => {
  if (value) {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map((item: string) => item[0].toUpperCase() + item.substring(1))
      .join(' ');
  }
  return '';
};

export const convertAllUpperCaseToSentenceCase = (value: string) => {
  if (value) {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map((item: string) => item[0] + item.substring(1).toLowerCase())
      .join(' ');
  }
  return '';
};
