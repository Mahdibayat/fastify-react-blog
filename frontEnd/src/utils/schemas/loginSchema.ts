import { z } from "zod";
import { regexList } from "../regex";

export const loginSchema = z.object({
  mobile: z.string().refine((v) => regexList.mobile.test(v), "معتبر نیست"),
  password: z.string(),
});
