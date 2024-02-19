import express from "express";

import { deleteDatabase } from "./routes/deletedb.js";
import { extratoRoute } from "./routes/extrato.js";
import { transferenciaRoute } from "./routes/transferencia.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
	res.send("hello world");
});

app.post("/clientes/:id/transacoes", transferenciaRoute);
app.get("/clientes/:id/extrato", extratoRoute);
app.get("/deletedb", deleteDatabase);

app.listen(process.env.HTTP_PORT || 8080, () => {
	console.log("server listening");
});
