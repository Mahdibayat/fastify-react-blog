import "@fastify/jwt";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}


declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number }; // داده‌ای که داخل توکن قرار می‌دی
    user: { id: number };    // داده‌ای که بعد از verify به req.user اضافه می‌شه
  }
}
