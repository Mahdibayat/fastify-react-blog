import { FastifyInstance } from "fastify";
import { db } from "../db.js";
import { normalizeUser } from "../utils/helper.js";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/detail", { preHandler: [app.authenticate] }, async (req, res) => {
    const userFromToken = req.user; // مقدار از JWT
    if (!userFromToken?.id) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", userFromToken.id)
      .executeTakeFirst();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return { message: "Authenticated", user: normalizeUser(user) };
  });
}
