import { expect, test } from "bun:test";

test("POST TO /clientes/1/transacoes: value: 200, type: D should return -200", async () => {
	const requestBody = {
		valor: 1,
		tipo: "d",
		descricao: "teste",
	};
	let response;
	for (let i = 0; i < 25; i++) {
		response = await fetch("http://localhost:9999/clientes/1/transacoes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});
	}

	const { limite, saldo } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo).toBe(-25);
	expect(limite).toBe(100000);
});

test("POST TO /clientes/1/transacoes: value: 200, type: C should return 0", async () => {
	const requestBody = {
		valor: 1,
		tipo: "c",
		descricao: "teste",
	};
	let response;
	for (let i = 0; i < 25; i++) {
		response = await fetch("http://localhost:9999/clientes/1/transacoes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});
	}

	const { limite, saldo } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo).toBe(0);
	expect(limite).toBe(100000);
});

test("GET TO /clientes/1/extrato should return total = 0 and 10 transactions", async () => {
	const response = await fetch("http://localhost:9999/clientes/1/extrato");
	const { saldo, ultimas_transacoes } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo.total).toBe(0);
	expect(saldo.limite).toBe(100000);

	expect(ultimas_transacoes.length).toBe(10);

	const isAllCredit = ultimas_transacoes.every((item) => item.tipo === "c");
	expect(isAllCredit).toBe(true);
});

test("Delete tests insertions from database", async () => {
	await fetch("http://localhost:9999/deletedb");
});
