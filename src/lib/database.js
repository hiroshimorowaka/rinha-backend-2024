import "dotenv/config";
import pgPromise from "pg-promise";

const pgp = pgPromise();

export const pool = pgp({
	connectionString: process.env.DATABASE_URL,
	max: 30,
	idleTimeoutMillis: 0,
	connectionTimeoutMillis: 10000,
});

async function connect() {
	try {
		await pool.$pool.connect();
	} catch (err) {
		console.error("Error connecting to pool, trying again in 3 seconds...");
		setTimeout(() => {
			connect();
		}, 3000);
	}
}

await connect();

pool.$pool.once("connect", () => {
	console.log("Database connected!");
	if (process.env.CREATE_TABLE === "true") {
		console.log("Creating tables...");
		pool.none(`
            
              DROP TABLE IF EXISTS "transacoes";
              DROP TABLE IF EXISTS "clientes";
            
            
              CREATE UNLOGGED TABLE "clientes" (
                  id SERIAL NOT NULL,
                  nome TEXT NOT NULL,
                  limite INTEGER NOT NULL,
                  saldo INTEGER NOT NULL DEFAULT 0,
              
                  CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
              );
              
              CREATE UNLOGGED TABLE "transacoes" (
                  id SERIAL NOT NULL,
                  valor INTEGER NOT NULL,
                  tipo CHAR(1) NOT NULL,
                  descricao VARCHAR(10) NOT NULL,
                  realizada_em TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  client_id INTEGER NOT NULL,
              
                  CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
              );
              
              CREATE INDEX idx_extrato ON transacoes (id DESC);
        
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
		console.log("Tables created!");
	}
});
