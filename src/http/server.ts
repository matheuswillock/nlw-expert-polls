import fastify from "fastify";
import cookie from "@fastify/cookie";
import { PingPong } from "./routes/ping";
import { GetPoll } from "./routes/get-poll";
import { CreatePoll } from "./routes/create-poll";
import { VoteOnPoll } from "./routes/vote-on-poll";
import {fastifyWebsocket} from "@fastify/websocket";
import {PollResults} from "./ws/poll-results.ts";

const app = fastify({logger: true});

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: 'onRequest'
});

app.register(fastifyWebsocket)

app.register(GetPoll);
app.register(PingPong);
app.register(VoteOnPoll);
app.register(CreatePoll);

app.register(PollResults);



const start = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 3333;

    await app.listen({
      host: '0.0.0.0',
      port: port
    });
    app.log.info(`Servidor iniciado em http://localhost:${port}`);

  } catch (exception) {
    app.log.error(exception);
    process.exit(1);
  }
};

start().then(() =>{
  console.log('Http Server Running')
})
