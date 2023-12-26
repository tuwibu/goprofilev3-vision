import { FastifyInstance, FastifySchema } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/",
    handler: async (request, reply) => {
      return reply.view("index.ejs");
    }
  });
}