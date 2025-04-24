export const isValidWalletAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return email.includes('@') && email.includes('.');
};

export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  return phone.length >= 10;
};

export const isValidName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2;
};

export const isValidDocumentNumber = (number) => {
  if (!number) return false;
  return number.length >= 5;
};

export const isValidPinCode = (pin) => {
  if (!pin) return false;
  return pin.length >= 6;
};

export const isValidAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  return aadhaar.length >= 12;
};

export const isValidIFSC = (ifsc) => {
  if (!ifsc) return false;
  return ifsc.length >= 11;
};
