import { AnyZodObject } from "zod";
import { type Request, type Response, type NextFunction, query } from "express";
import { log } from "../utils/logger";
import { AppError } from "../utils/customError";
export function validate(schema: AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (result.error) {
        const errorMessage = (
          JSON.parse(result.error.message) as [
            {
              message: string;
            }
          ]
        ).map((el) => el.message);

        throw new AppError("Invalid input", errorMessage);
      }
      next();
    } catch (e) {
      log.error(e);
      next(e);
    }
  };
}
