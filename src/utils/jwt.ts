import jwt, { SignOptions } from "jsonwebtoken";
export function sign(payload: Object, options?: SignOptions) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    ...options,
  });
  return token;
}
