import type { FastifyInstance } from "fastify";

export async function PingPong(app: FastifyInstance) {
  app.get('/ping', () => {
    return 'pong';
  })
}