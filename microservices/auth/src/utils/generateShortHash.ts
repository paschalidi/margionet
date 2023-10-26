import crypto from "crypto";

export const generateShortHash = (email: string) => {
  const hash = crypto.createHash('sha256').update(email).digest('hex');
  return hash.substring(0, 24);
};
