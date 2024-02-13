import "dotenv/config";
import pg from "pg";

const pgp = require("pg-promise");

export const pool = pgp(process.env.DATABASE_URL);

if (process.env.CREATE_TABLE === "true") {
	console.log("Conectado ao banco de dados, criando tabelas...");
	pool.none(`
    
      DROP TABLE IF EXISTS "transacoes";
      DROP TABLE IF EXISTS "clientes";
    
    
      CREATE TABLE "clientes" (
          id SERIAL NOT NULL,
          nome TEXT NOT NULL,
          limite INTEGER NOT NULL,
          saldo INTEGER NOT NULL DEFAULT 0,
      
          CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
      );
      
      CREATE TABLE "transacoes" (
          id SERIAL NOT NULL,
          valor INTEGER NOT NULL,
          tipo CHAR(1) NOT NULL,
          descricao VARCHAR(10) NOT NULL,
          realizada_em TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          client_id INTEGER NOT NULL,
      
          CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
      );
      
      CREATE UNIQUE INDEX "clientes_id_key" ON "clientes"("id");
      
      CREATE UNIQUE INDEX "transacoes_id_key" ON "transacoes"("id");
      
      ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_clientesId_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    
      DO $$
      BEGIN
        INSERT INTO clientes (nome, limite)
        VALUES
          ('o barato sai caro', 1000 * 100),
          ('zan corp ltda', 800 * 100),
          ('les cruders', 10000 * 100),
          ('padaria joia de cocaia', 100000 * 100),
          ('kid mais', 5000 * 100);
      END; $$
      `);
	console.log("tabelas criadas");
}

// const URL =
// 	process.env.DATABASE_URL || "postgres://docker:docker@localhost:5432/rinha";

// export const pool = new pg.Pool({
// 	connectionString: URL,
// 	max: Number(process.env.DB_POOL) || 35,
// 	idleTimeoutMillis: 0,
// 	connectionTimeoutMillis: 10000,
// });

// pool.on("error", connect);

// async function connect() {
// 	try {
// 		console.log(
// 			`Conectando ao banco ${URL}\nPool size: ${process.env.DB_POOL}`,
// 		);
// 		await pool.connect();
// 	} catch (err) {
// 		setTimeout(() => {
// 			connect();
// 			console.error(
// 				`Erro ao conectar na pool ${err}, tentando novamente em 3 segundos!`,
// 			);
// 		}, 3000);
// 	}
// }

// connect();

// pool.once("connect", () => {
// 	if (process.env.CREATE_TABLE === "true") {
// 		console.log("Conectado ao banco de dados, criando tabelas...");
// 		pool.query(`

//     DROP TABLE IF EXISTS "transacoes";
//     DROP TABLE IF EXISTS "clientes";

//     CREATE TABLE "clientes" (
//         id SERIAL NOT NULL,
//         nome TEXT NOT NULL,
//         limite INTEGER NOT NULL,
//         saldo INTEGER NOT NULL DEFAULT 0,

//         CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
//     );

//     CREATE TABLE "transacoes" (
//         id SERIAL NOT NULL,
//         valor INTEGER NOT NULL,
//         tipo CHAR(1) NOT NULL,
//         descricao VARCHAR(10) NOT NULL,
//         realizada_em TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         client_id INTEGER NOT NULL,

//         CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
//     );

//     CREATE UNIQUE INDEX "clientes_id_key" ON "clientes"("id");

//     CREATE UNIQUE INDEX "transacoes_id_key" ON "transacoes"("id");

//     ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_clientesId_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

//     DO $$
//     BEGIN
//       INSERT INTO clientes (nome, limite)
//       VALUES
//         ('o barato sai caro', 1000 * 100),
//         ('zan corp ltda', 800 * 100),
//         ('les cruders', 10000 * 100),
//         ('padaria joia de cocaia', 100000 * 100),
//         ('kid mais', 5000 * 100);
//     END; $$
//         `);
// 		console.log("tabelas criadas");
// 	}

// 	return;
// });
