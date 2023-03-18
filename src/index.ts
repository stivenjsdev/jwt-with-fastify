import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { fastifyJwt } from "@fastify/jwt";
import { router } from "./routes";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

const fastify: FastifyInstance = Fastify({ logger: true });


fastify.register(fastifyJwt, { secret: "supersecret" });

fastify.register(router);


const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    const serverAddress = fastify.server.address();
    if (typeof serverAddress === "object" && serverAddress !== null) {
      const { port, address } = serverAddress;
      console.log(`Server listening at http://${address}:${port}`);
    } else {
      console.log(`Server listening at ${serverAddress}`);
    }
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
