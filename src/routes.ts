import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export const router: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
) => {
  // authentication decorator
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    }
  );

  // Generate token
  fastify.get<{
    Params: { username: string };
  }>("/generateToken/:username", async (request, reply) => {
    const { username } = request.params;
    const token = fastify.jwt.sign({ username });
    return { token };
  });

  // Validate token
  fastify.get(
    "/validateToken",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return request.user;
    }
  );

  // Home route
  fastify.get(
    "/home",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      return { hello: "world" };
    }
  );
};
