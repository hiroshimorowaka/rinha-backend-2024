import { pool } from "../lib/database";

export async function extratoRoute(app) {
	app.get("/clientes/:id/extrato", async (request, response) => {
		const urlParams = Number.isInteger(Number(request.params.id))
			? Number(request.params.id)
			: false;

		if (!urlParams) {
			return response
				.status(422)
				.send("Nao tem parametro ou nao é um numero inteiro");
		}

		const clientLimit = await pool.query(
			"SELECT limite FROM clientes WHERE id = $1",
			[urlParams],
		);

		if (clientLimit.rowCount === 0) {
			return response.status(404).send("cliente nao encontrado");
		}

		const databaseQuery = `
    (select saldo as valor, 'valor' as tipo, 'valor' as descricao, now() as realizada_em from clientes where id = $1) 
    union all 
    (select valor, tipo, descricao, realizada_em from transacoes
    where client_id = $1
    order by id desc limit 10)`;

		const queryResult = await pool.query(databaseQuery, [urlParams]);
		const [clientInformation, ...transactionInformations] = queryResult.rows;
		const objToSend = {
			saldo: {
				total: clientInformation.valor,
				data_extrato: new Date(),
				limite: clientLimit.rows[0].limite,
			},
			ultimas_transacoes: transactionInformations,
		};
		return response.status(200).send(objToSend);
	});
}
