import fastify from "fastify";
import { PingPong } from "./routes/ping";
import { GetPoll } from "./routes/get-poll";
import { CreatePoll } from "./routes/create-poll";
import { VoteOnPoll } from "./routes/vote-on-poll";
import cookie, { type FastifyCookieOptions } from "@fastify/cookie";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: 'onRequest'
} as FastifyCookieOptions);
app.register(GetPoll);
app.register(PingPong);
app.register(VoteOnPoll);
app.register(CreatePoll);

app.listen({ port: 3333}).then(() => {
  console.log(`HTTP Sever is Running on http://localhost:3333/`)
});
