import Fastify from "fastify";
import { deleteDatabase } from "./routes/deletedb.js";
import { extratoRoute } from "./routes/extrato.js";
import { transferenciaRoute } from "./routes/transferencia.js";

const app = Fastify();

app.register(transferenciaRoute);
app.register(extratoRoute);
app.register(deleteDatabase);

app.get("/", (_, response) => {
	response.status(200).send({ hello: "World!" });
});

app.listen({ port: process.env.HTTP_PORT || 8080, host: "0.0.0.0" });

console.log("Hello via Bun!");
