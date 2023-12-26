import { Readable } from "stream";
import {
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  InternalServerError,
  ServiceUnavailable,
  TooManyRequests
} from "../plugins/error";
import { IncomingMessage, ServerResponse } from "http";
import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from "fastify";
export type IFastify = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>;
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
declare module "fastify" {
  interface FastifyInstance {
    httpErrors: {
      BadRequest: typeof BadRequest,
      Unauthorized: typeof Unauthorized,
      PaymentRequired: typeof PaymentRequired,
      Forbidden: typeof Forbidden,
      NotFound: typeof NotFound,
      Conflict: typeof Conflict,
      UnprocessableEntity: typeof UnprocessableEntity,
      InternalServerError: typeof InternalServerError,
      ServiceUnavailable: typeof ServiceUnavailable,
      TooManyRequests: typeof TooManyRequests
    }
  }
  interface FastifyRequest {
    file?: MulterFile,
  }
}