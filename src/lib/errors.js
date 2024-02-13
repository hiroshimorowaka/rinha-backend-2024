export class SaldoInsuficienteError extends Error {
	constructor(message) {
		super(message); // (1)
		this.name = 422; // (2)
	}
}

export class ClienteNaoEncontradoError extends Error {
	constructor(message) {
		super(message); // (1)
		this.name = 404; // (2)
	}
}
