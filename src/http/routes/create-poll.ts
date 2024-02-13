import { z } from "zod"
import Prisma from "../../lib/prisma";
import { type FastifyInstance } from "fastify";

export async function CreatePoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string())
  })

  const {title, options} = createPollBody.parse(request.body)

  const poll = await Prisma.poll.create({
    data: {
      title,
      options: {
        createMany: {
          data: options.map(option => {
            return {title: option}
          })
        }
      }
    }
  })

  return reply.status(201).send({pollId: poll.id})

})
}