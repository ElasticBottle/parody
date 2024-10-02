import { webcrypto } from "node:crypto";

export const generateId = (length = 32) => {
  const buffer = webcrypto.getRandomValues(new Uint8Array(length));
  // TODO: get a converter to convert buffer to string
  return buffer.toString();
};
