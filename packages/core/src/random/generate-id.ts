export const generateId = (length = 32) => {
  const buffer = crypto.getRandomValues(new Uint8Array(length));
  return Buffer.from(buffer).toString("base64");
};
