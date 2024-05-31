import { Request } from "express";
import { UserDoc } from "../services/user.service";

interface RequestI<T = any, L = any, U = any, K = any>
  extends Request<T, L, U, K> {
  user: UserDoc;
}
