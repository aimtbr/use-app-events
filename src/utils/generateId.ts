const PREFIX_DEFAULT: string = ':m-';
const SUFFIX_DEFAULT: string = ':';

let instanceId: number = 0;

export const generateId = (prefix = PREFIX_DEFAULT): string => {
  instanceId += 1;

  const id = `${prefix}${instanceId}${SUFFIX_DEFAULT}`;

  return id;
};
