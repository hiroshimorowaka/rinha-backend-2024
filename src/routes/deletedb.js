import { pool } from "../lib/database";

export async function deleteDatabase(app) {
	app.get("/deletedb", async (_, response) => {
		await pool.query(`

    UPDATE clientes SET saldo = 0;
    truncate table transacoes;

        `);
		return response.send("Tabelas resetadas");
	});
}
