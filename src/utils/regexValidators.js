export const isValidWalletAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  return /^\+?[1-9]\d{1,14}$/.test(phone);
};

export const isValidName = (name) => {
  if (!name) return false;
  return /^[a-zA-Z\s]{2,50}$/.test(name);
};

export const isValidDocumentNumber = (number) => {
  if (!number) return false;
  return /^[A-Za-z0-9]{5,20}$/.test(number);
};
