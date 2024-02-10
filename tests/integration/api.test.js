import { expect, test } from "bun:test";

test("POST TO /clientes/1/transacoes: value: 200, type: D should return -200", async () => {
	const requestBody = {
		valor: 200,
		tipo: "d",
		descricao: "teste",
	};
	const response = await fetch("http://localhost:8080/clientes/1/transacoes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	});
	const { limite, saldo } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo).toBe(-200);
	expect(limite).toBe(100000);
});

test("POST TO /clientes/1/transacoes: value: 200, type: C should return 0", async () => {
	const requestBody = {
		valor: 200,
		tipo: "c",
		descricao: "teste",
	};
	const response = await fetch("http://localhost:8080/clientes/1/transacoes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	});
	const { limite, saldo } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo).toBe(0);
	expect(limite).toBe(100000);
});

test("GET TO /clientes/1/extrato should return total = 0 and 2 transactions", async () => {
	const requestBody = {
		valor: 200,
		tipo: "c",
		descricao: "teste",
	};
	const response = await fetch("http://localhost:8080/clientes/1/extrato");
	const { saldo, ultimas_transacoes } = await response.json();

	expect(response.status).toBe(200);

	expect(saldo.total).toBe(0);
	expect(saldo.limite).toBe(100000);

	expect(ultimas_transacoes.length).toBe(2);
	expect(ultimas_transacoes[0].tipo).toBe("c");
	expect(ultimas_transacoes[1].tipo).toBe("d");
});
