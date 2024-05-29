import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "./../utils/customError";
export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(400).json({
      message: err.message,
    });
  } else {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
}
