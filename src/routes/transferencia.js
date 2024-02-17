import { pool } from "../lib/database";

export async function transferenciaRoute(app) {
	app.post("/clientes/:id/transacoes", async (request, response) => {
		const clientdId = Number.isInteger(Number(request.params.id))
			? Number(request.params.id)
			: false;
		const bodyParams = request.body;

		if (!clientdId) {
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
			return response.status(422).send();
		}

		let saldo = bodyParams.valor;
		if (bodyParams.tipo === "d") {
			saldo = -bodyParams.valor;
		}
		try {
			const result = await pool.tx(async (t) => {
				await t.one("SELECT pg_advisory_xact_lock($1)", [clientdId]);
				const clientObjResponse = await t.oneOrNone(
					"SELECT * FROM clientes WHERE id = $1;",
					clientdId,
				);

				if (!clientObjResponse) {
					return { status: 404 };
				}

				if (
					bodyParams.tipo === "d" &&
					clientObjResponse.saldo - bodyParams.valor <
						clientObjResponse.limite * -1
				) {
					return { status: 422 };
				}

				const newClientInformations = await t.one(
					"UPDATE clientes SET saldo = saldo + $1 WHERE id = $2 RETURNING saldo, limite", //pegar o saldo da query acima ?
					[saldo, clientdId],
				);
				await t.none(
					"INSERT INTO transacoes(valor, tipo,descricao, client_id) VALUES ($1, $2,$3, $4)",
					[bodyParams.valor, bodyParams.tipo, bodyParams.descricao, clientdId],
				);

				const objToSend = {
					saldo: newClientInformations.saldo,
					limite: newClientInformations.limite,
				};

				return { status: 200, message: objToSend };
			});

			return response.status(result.status || 522).send(result.message);
		} catch (error) {
			return response.status(Number(error.name) || 477).send(error.message);
		}
	});
}
