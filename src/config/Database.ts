import {Pool, Client, PoolClient} from "pg";
import WWError from "../types/WWError";
import dotenv from "dotenv";

dotenv.config();

const params: {[p: string]: any | undefined} = {
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT
};

// Check .env
Object.keys(params).forEach(key => {
    if(!params[key]) {
        console.error(`Need to set environment variable: ${key}`);
        process.exit(0);
    }
})

const pool = new Pool({
    host: params.DATABASE_HOST,
    port: params.DATABASE_PORT,
    database: params.DATABASE_NAME,
    user: params.DATABASE_USERNAME,
    password: params.DATABASE_PASSWORD
});

const getClient = async () => {
    let client: PoolClient;
    try {
        client = await pool.connect();
    } catch (e) {
        throw WWError.handlingError(e);
    }

    return client;
}

export default { pool, getClient };
