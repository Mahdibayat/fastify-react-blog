import "@fastify/jwt";
import "fastify";
import { IUser, IUserRoles } from "./interfaces.ts";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: IUser; // داده‌ای که داخل توکن قرار می‌دی
    user: IUser; // داده‌ای که بعد از verify به req.user اضافه می‌شه
  }
}

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      JWT_SECRET: string;
    };
  }
}
