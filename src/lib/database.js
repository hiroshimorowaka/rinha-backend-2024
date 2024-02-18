import "dotenv/config";
import pgPromise from "pg-promise";

const pgp = pgPromise();

export const pool = pgp(process.env.DATABASE_URL);

if (process.env.CREATE_TABLE === "true") {
	console.log("Conectando ao banco de dados e criando tabela...");

	// Aqui tem um race condition entre o postgres subir e ele realmente executar a query,
	//não sei se é só na hora de buildar a imagem,
	// mas ele ta iniciando antes do banco começar a aceitar conexões,
	// então ele falha e crasheia, não sei exatamente como tentar fazer a reconexão usando o pg-promise
	// então essa foi a melhor maneira que encontrei atualmente.

	setTimeout(async () => {
		await pool.none(`
    
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
		console.log("Tabelas Criadas");
	}, 5000);
}
