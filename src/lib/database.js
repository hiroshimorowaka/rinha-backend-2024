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
	console.log(`Database connected! ${process.pid}`);
});
