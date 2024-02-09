import "dotenv/config";
import Fastify from "fastify";
import { extratoRoute } from "./routes/extrato";
import { transferenciaRoute } from "./routes/transferencia";

const app = Fastify();

app.register(transferenciaRoute);
app.register(extratoRoute);

app.get("/", (_, response) => {
	response.status(200).send({ hello: "World!" });
});

app.listen({ port: process.env.HTTP_PORT || 8080, host: "0.0.0.0" });

console.log("Hello via Bun!");
