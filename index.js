const fastify = require("fastify")({ logger: true });
const jwt = require("@fastify/jwt");

fastify.register(jwt, {
  secret: "supersecret",
});

// authentication decorator
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.send(error);
  }
});

// Generate token
fastify.get("/generateToken/:id", (request, reply) => {
  const { id } = request.params;
  const user = { name: id };
  const token = fastify.jwt.sign(user);
  reply.send({ token });
});

// Validate token
fastify.get(
  "/validateToken",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    return request.user;
  }
);

// home route
fastify.get(
  "/home",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    return { hello: "world" };
  }
);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    const { port, address } = fastify.server.address();
    console.log(`Server is running at http://${address}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
