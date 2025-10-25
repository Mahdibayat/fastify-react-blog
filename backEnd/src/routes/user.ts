import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/detail",
    { preHandler: [app.authenticate, app.guard.role(["admin"])] },
    async (req, res) => {
      const user = req.user; // مقدار از JWT
      if (!user?.id) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      return { message: "Authenticated", user };
    }
  );

  app.get(
    "/list",
    { preHandler: [app.authenticate, app.guard.role(["admin"])] },
    async (req, res) => {
      const users = await db.selectFrom("users").selectAll().execute();
      return {
        message: "Authenticated",
        status: "success",
        users: users.map((user) => {
          const { password, ...other } = user;
          return other;
        }),
      };
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/delete/:id",
    { preHandler: [app.authenticate, app.guard.role(["admin"])] },
    async (req, res) => {
      debugger;
      const id = Number(req.params.id);
      if (!id) res.status(422).send({ message: "کاربری انتخاب نشده است" });

      const user = await db
        .selectFrom("users")
        .where("id", "==", id)
        .executeTakeFirst();
      if (!user) {
        res.status(404).send({ message: "کاربری با این آیدی یافت نشد" });
      }
      debugger;
      await db.deleteFrom("users").where("id", "=", id).execute();
      debugger;
      return res.status(200).send({
        message: "کاربر با موفقیت حذف شد",
        status: "success",
      });
    }
  );
}
