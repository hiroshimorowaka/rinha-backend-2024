import { pool } from "../lib/database.js";

export async function deleteDatabase(request, response) {
	await pool.query(`

    UPDATE clientes SET saldo = 0;
    truncate table transacoes;

        `);
	return response.send("Tabelas resetadas");
}
