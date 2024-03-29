import { z } from "zod";
import { randomUUID } from "node:crypto";
import { type FastifyInstance } from "fastify";
import Prisma from "../../lib/prisma";
import {redis} from "../../lib/redis.ts";
import {voting} from "../../utils/VotingPubSub.ts";

export async function VoteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    
    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    });
    
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const {pollId} = voteOnPollParams.parse(request.params);
    const {pollOptionId} = voteOnPollBody.parse(request.body);

    let {sessionId} = request.cookies;

    if(sessionId) {
      const userPreviousVoteOnPoll = await Prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      if(userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId != pollOptionId) {

        await Prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })

        const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes),
        })

      } else if (userPreviousVoteOnPoll) {
        return reply.status(400).send({message: 'You already voted on this poll.'})
      }
    }

    if (!sessionId ) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60*60*24*30, // 30 days
        signed: true,
        httpOnly: true
      });
    }

    await Prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    const votes =  await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
    })

    return reply.status(201).send({ sessionId });

  })
}