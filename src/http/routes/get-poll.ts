import { z } from "zod"
import Prisma from "../../lib/prisma";
import { type FastifyInstance } from "fastify";

export async function GetPoll(app: FastifyInstance) {
  app.post('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
    pollId: z.string().uuid()
  })

  const {pollId} = getPollParams.parse(request.params)

  const poll = await Prisma.poll.findUnique({
    where: {
      id: pollId
    },
    include: {
      options: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  return reply.send({poll});

})
}