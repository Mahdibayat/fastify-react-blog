import { z } from "zod";
import { regexList } from "../regex.js";

export const registerSchema = z.object({
  mobile: z.string().refine((v) => regexList.mobile.test(v), "معتبر نیست"),
  password: z.string().refine((v) => regexList.pass.test(v), "قوی نیست"),
  name: z.string(),
  surname: z.string(),
});
