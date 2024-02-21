import cluster from "cluster";

import express from "express";
import { deleteDatabase } from "./routes/deletedb.js";
import { extratoRoute } from "./routes/extrato.js";
import { transferenciaRoute } from "./routes/transferencia.js";

const numCPUs = 3;

if (cluster.isPrimary) {
	console.log(`Master process ${process.pid} is running`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		console.log(`Worker process ${worker.process.pid} died. Restarting...`);
		cluster.fork();
	});
} else {
	const app = express();
	app.use(express.json());
	app.get("/", (_, res) => {
		res.send("hello world");
	});

	app.post("/clientes/:id/transacoes", transferenciaRoute);
	app.get("/clientes/:id/extrato", extratoRoute);
	app.get("/deletedb", deleteDatabase);

	app.listen(process.env.HTTP_PORT || 8080, () => {
		console.log("server listening");
	});
}
