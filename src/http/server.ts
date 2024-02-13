import fastify from "fastify";

const app = fastify();

app.get('/', () =>{
  return 'Hello nlw'
})

app.listen({ port: 3333}).then(() => {
  console.log(`HTTP Sever is Running on http://localhost:3333/`)
});
