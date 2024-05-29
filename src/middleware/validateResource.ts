import { AnyZodObject } from "zod";
import { type Request, type Response, type NextFunction, query } from "express";
export function validate(schema: AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (e) {
      next(e);
    }
  };
}
