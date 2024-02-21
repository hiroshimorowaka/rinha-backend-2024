import { request, response } from "express";
import { pool } from "../lib/database.js";
import {
	ClienteNaoEncontradoError,
	SaldoInsuficienteError,
} from "../lib/errors.js";
/**
 * @param {request} request
 * @param {response} response
 * @returns
 */
export async function transferenciaRoute(request, response) {
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
		return response
			.status(422)
			.send(
				"O corpo da requisição precisa conter 'tipo', 'valor' e 'descricao' ",
			);
	}

	let saldo = bodyParams.valor;
	if (bodyParams.tipo === "d") {
		saldo = -bodyParams.valor;
	}
	try {
		await pool.tx(async (t) => {
			await t.one("SELECT pg_advisory_xact_lock($1)", [clientdId]);
			const clientObjResponse = await t.oneOrNone(
				"SELECT * FROM clientes WHERE id = $1;",
				clientdId,
			);

			if (!clientObjResponse) {
				throw new ClienteNaoEncontradoError("Cliente não encontrado!");
			}

			if (
				bodyParams.tipo === "d" &&
				clientObjResponse.saldo - bodyParams.valor <
					clientObjResponse.limite * -1
			) {
				throw new SaldoInsuficienteError("Saldo insuficiente!");
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
			return response.status(200).send(objToSend);
		});
	} catch (error) {
		return response.status(Number(error.status) || 501).send(error.message);
	}
}
