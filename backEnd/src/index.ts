import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import { authRoutes } from "./routes/auth.js";
import { db } from "./db.js";
import createTable from "./utils/createTable.js";
import userRoutes from "./routes/user.js";

const app = fastify();

// plugins
await app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(jwt, { secret: "supersecret" });

// decorators
app.decorate("authenticate", async function (req, reply) {
  try {
    await req.jwtVerify(); // توکن رو بررسی می‌کنه
  } catch (err) {
    reply.code(401).send({ message: "Unauthorized" });
  }
});

await app.register(
  async (api) => {
    await api.register(authRoutes, { prefix: "/auth" });
    await api.register(userRoutes, {prefix: "/user"})
  },

  { prefix: "/api" }
);

app.get("/", async () => ({ message: "root ok" }));

await createTable("users");
app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
