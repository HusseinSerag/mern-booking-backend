import jwt, { SignOptions } from "jsonwebtoken";
export function sign(payload: Object, options?: SignOptions) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    ...options,
  });
  return token;
}

export function verify(token: string) {
  try {
    const decodedURL = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as jwt.JwtPayload;

    return decodedURL;
  } catch (e) {
    throw e;
  }
}
