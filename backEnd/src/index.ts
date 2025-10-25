import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastify from "fastify";
import fastifyGuard from "fastify-guard";
import { authRoutes } from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import initialTables from "./utils/createTable.js";
import fastifyEnv from "@fastify/env";

const app = fastify({ logger: true });

// plugins
const schema = {
  type: "object",
  required: ["PORT", "JWT_SECRET"],
  properties: {
    PORT: { type: "string", default: "3000" },
    JWT_SECRET: { type: "string" },
  },
};
await app.register(fastifyEnv, {
  dotenv: true, // فایل .env رو بخونه
  schema,
  data: process.env, // این خط تضمین می‌کنه متغیرها در دسترس باشن
});

await app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(jwt, { secret: app.config.JWT_SECRET });

app.register(fastifyGuard.default, {
  requestProperty: "user", // object who have `roleProperty` > req.user have role
  roleProperty: "role", // key who have role on it
});

// decorators
app.decorate("authenticate", async function (req, reply) {
  try {
    await req.jwtVerify(); // توکن رو بررسی می‌کنه
  } catch (err) {
    reply.code(401).send({ message: "کاربر اعتبارسنجی نشده است" });
  }
});

// APP ROUTES
await app.register(
  async (api) => {
    await api.register(authRoutes, { prefix: "/auth" });
    await api.register(userRoutes, { prefix: "/user" });
  },

  { prefix: "/api" }
);
app.get("/", async () => ({ message: "root ok" }));

// INITIAL TABLE IF NOT HAVE
await initialTables();

// START APP ON PORT
app.listen({ port: +app.config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
