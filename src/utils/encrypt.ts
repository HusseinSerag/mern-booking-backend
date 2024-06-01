import crypto from "crypto";
export default function encrypt(token: string) {
  const newToken = crypto.createHash("sha256").update(token).digest("hex");

  return newToken;
}
