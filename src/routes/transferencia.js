import { pool } from "../lib/database";

export async function transferenciaRoute(app) {
	app.post("/clientes/:id/transacoes", async (request, response) => {
		const urlParams = Number.isInteger(Number(request.params.id))
			? Number(request.params.id)
			: false;
		const bodyParams = request.body;

		if (!urlParams) {
			return response
				.status(422)
				.send("Nao tem parametro ou nao é um numero inteiro");
		}
		const re = /[c/d]/g;
		if (
			!bodyParams ||
			!bodyParams.valor ||
			!bodyParams.descricao ||
			!bodyParams.tipo ||
			!Number.isInteger(Number(bodyParams.valor)) ||
			!bodyParams.tipo.match(re) ||
			bodyParams.descricao.length < 1 ||
			bodyParams.descricao.length > 10
		) {
			return response.status(422).send("Body ta erradao");
		}
		const clientObjResponse = await pool.query(
			"SELECT * FROM clientes WHERE id = $1",
			[urlParams],
		);
		if (clientObjResponse.rowCount === 0) {
			return response.status(404).send("Cliente nao encontrado");
		}

		const clientObj = clientObjResponse.rows[0];

		if (
			bodyParams.tipo === "d" &&
			clientObj.saldo - bodyParams.valor < clientObj.limite * -1
		) {
			return response
				.status(422)
				.send("Eai irmao, ta achando q pode passar mais doq tem?");
		}
		let saldo;
		if (bodyParams.tipo === "d") {
			saldo = clientObj.saldo - bodyParams.valor;
		}
		if (bodyParams.tipo === "c") {
			saldo = clientObj.saldo + bodyParams.valor;
		}

		const client = await pool.connect();
		try {
			await client.query("BEGIN");
			await client.query("SELECT pg_advisory_xact_lock($1)", [urlParams]);

			const newClientInformations = await client.query(
				"UPDATE clientes SET saldo = $1 WHERE id = $2 RETURNING saldo, limite",
				[saldo, urlParams],
			);

			await client.query(
				"INSERT INTO transacoes(valor, tipo,descricao, client_id) VALUES ($1, $2,$3, $4)",
				[bodyParams.valor, bodyParams.tipo, bodyParams.descricao, urlParams],
			);
			await client.query("COMMIT");

			const objToSend = {
				saldo: newClientInformations.rows[0].saldo,
				limite: newClientInformations.rows[0].limite,
			};

			return response.status(200).send(objToSend);
		} catch (e) {
			await client.query("ROLLBACK");
			console.error("Error on transaction Transaçoes ENDPOINT");
			return response.status(500).send("fudeu");
		} finally {
			client.release();
		}
	});
}
