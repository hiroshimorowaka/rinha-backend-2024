import hp from "hyper-express";
// import { deleteDatabase } from "./routes/deletedb.js";
import { extratoRoute } from "./routes/extrato.js";
import { transferenciaRoute } from "./routes/transferencia.js";

const api_v1_router = new hp.Router();

api_v1_router.post("/clientes/:id/transacoes", transferenciaRoute);
api_v1_router.get("/clientes/:id/extrato", extratoRoute);

// import express from "express";

// const app = express();
// app.use(express.json());
// app.get("/", (req, res) => {
// 	res.send("hello world");
// });

// app.post("/clientes/:id/transacoes", transferenciaRoute);
// app.get("/clientes/:id/extrato", extratoRoute);

// app.listen(process.env.HTTP_PORT || 8080, () => {
// 	console.log("server listening");
// });
