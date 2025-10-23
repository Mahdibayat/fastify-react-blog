import { FastifyInstance } from "fastify";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/detail",
    { preHandler: [app.authenticate, app.guard.role(["admin"])] },
    async (req, res) => {
      debugger;
      const user = req.user; // مقدار از JWT
      if (!user?.id) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      return { message: "Authenticated", user };
    }
  );
}
