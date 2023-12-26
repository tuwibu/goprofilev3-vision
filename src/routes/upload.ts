import fs from "fs";
import path from "path";
import multer from "fastify-multer";
import { FastifyInstance, FastifySchema } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import ocrImage from "../helpers/ocr";
import logger from "../helpers/logger";

// multer
const __folderUpload = path.join(__dirname, "../../uploads");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(__folderUpload)) fs.mkdirSync(__folderUpload, { recursive: true })
    cb(null, __folderUpload);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
// schema
const BodySchema = Type.Object({
  file: Type.Optional(Type.String({
    format: "binary"
  })),
});
const myRouteSchema: FastifySchema & {
  consumes: string[];
} = {
  consumes: ["multipart/form-data"],
  body: BodySchema
};

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: "POST",
    url: "/upload",
    preValidation: upload.single("file"),
    schema: myRouteSchema,
    handler: async (request, reply) => {
      const ocr = await ocrImage(request.file.path);
      try {
        fs.unlinkSync(request.file.path);
      } catch(ex) {
        logger.error(ex);
      }
      return reply.send({
        success: true,
        data: {
          file: request.file.filename,
          text: ocr
        }
      });
    }
  });
}