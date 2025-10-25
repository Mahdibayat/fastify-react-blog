import { FastifyInstance } from "fastify";
import { db } from "../db.js";
import { registerSchema } from "../utils/schemas/usersSchemas.js";
import bcrypt from "bcrypt";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        issues: result.error.issues,
      });
    }
    const body = result.data;

    // بررسی کاربر تکراری
    const existing = await db
      .selectFrom("users")
      .selectAll()
      .where("mobile", "=", body.mobile)
      .executeTakeFirst();

    if (existing) {
      return reply
        .status(400)
        .send({ message: "این شماره همراه قبلا ثبت شده است." });
    }

    // رمزگذاری پسورد
    const hashed = await bcrypt.hash(body.password, 10);

    const user = await db
      .insertInto("users")
      .values({
        name: body.name,
        surname: body.surname,
        mobile: body.mobile,
        password: hashed,
        role: "author",
      })
      .returningAll()
      .executeTakeFirst();

    return { message: "User registered", user };
  });

  app.post("/login", async (req, reply) => {
    const body = req.body as { mobile: string; password: string };

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("mobile", "=", body.mobile)
      .executeTakeFirst();

    if (!user) {
      return reply.status(401).send({ message: "کاربر یافت نشد" });
    }

    // چک کردن پسورد
    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      return reply.status(401).send({ message: "گذرواژه اشتباه است" });
    }

    // ✅ ساخت JWT Token
    const token = app.jwt.sign(
      {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
      { expiresIn: "1d" }
    );

    return reply.send({ message: "Login successful", token });
  });
}
