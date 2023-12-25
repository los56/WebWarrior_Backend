import Database from "./Database";

const config = () => {
    process.on('exit', () => {
        listener();
    });

    process.on('SIGINT', () => {
        listener();
    });
}

const listener = () => {
    closePool();
    process.exit(0);
}

const closePool = () => {
    const { pool } = Database;
    pool.end().then(r => {
        console.log('Database connection closed');
    });
}

export default { config };
