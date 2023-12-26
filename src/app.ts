import path from "path";
import dotenv from "dotenv";
import fastify from "fastify";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import multer from "fastify-multer";
import errorPlugin from "./plugins/error";
import fastifyView from "@fastify/view";
import logger from "./helpers/logger";

dotenv.config();
const app = fastify({
  logger: false,
});
app.register(errorPlugin);
// middleware
app.register(fastifyView, {
  engine: {
    ejs: require("ejs")
  },
  root: path.resolve(__dirname, "..", "views")
});
app.register(cors);
app.register(multer.contentParser);
// handle error
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`
  });
});
app.setErrorHandler((error, request, reply) => {
  logger.error(error);
  return reply.status(error?.statusCode || 500).send({
    success: false,
    message: error.message
  });
});
app.register(autoload, {
  dir: path.resolve(__dirname, "routes"),
  dirNameRoutePrefix: true
});

app.listen({
  port: parseInt(process.env.PORT || "5000"),
  host: process.env.HOST || "0.0.0.0"
}, async(err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  // await initSetting(app.prisma);
  console.log(`Server listening at ${address}`); 
});