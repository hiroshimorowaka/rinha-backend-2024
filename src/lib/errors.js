export class SaldoInsuficienteError extends Error {
	constructor(message) {
		super(message);
		this.name = "Unprocessable Entity";
		this.status = 422;
	}
}

export class ClienteNaoEncontradoError extends Error {
	constructor(message) {
		super(message);
		this.name = "Not Found";
		this.status = 404;
	}
}
