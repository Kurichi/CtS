import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config();

const db_config: mysql.PoolOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}
const pool: mysql.Pool = mysql.createPool(db_config);

export function login(id: string): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`select * from admin where id = '${id}';`, function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket[]) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(rows);
            });
            connection.release();
        });
    });
}

export function getPositionList(): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`select * from positionlist`, function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket[]) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(rows);
            });
            connection.release();
        });
    });
}

export function getName(id: number): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`select * from memberlist where id = ${id};`, function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket[]) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(rows);
            });
            connection.release();
        });
    });
}

export function setSeat(data: any): void {
    pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
        connection.query(`update positionlist set id = ${data.id}, name = '${data.name}' where position = ${data.position};`, function (err: mysql.QueryError) {
            if (err) {
                console.log(err);
                return;
            }
        });
        connection.release();
    });
}

export function searchId(id: number): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`select position from positionlist where id = ${id};`, function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket[]) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(rows);
            });
            connection.release();
        });
    });
}

export function searchEmpty(): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`select position from positionlist where id is null;`, function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket[]) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve(rows);
            });
            connection.release();
        });
    });
}

export function swap(p1: number, p2: number): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`update positionlist as h1, positionlist as h2 set h1.id = h2.id, h1.name = h2.name where (h1.position = ${p1} and h2.position = ${p2}) or (h1.position = ${p2} and h2.position = ${p1});`, function (err: mysql.QueryError) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve();
            });
            connection.release();
        });
    });
}

export function cancel(position: number): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`update positionlist set id = null, name = null where position = ${position};`, function (err: mysql.QueryError) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve();
            });
            connection.release();
        });
    });
}

export function reset(): Promise<unknown> {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) {
            connection.query(`update positionlist set id = null, name = null;`, function (err: mysql.QueryError) {
                if (err) {
                    console.log(err);
                    return;
                }
                resolve();
            });
            connection.release();
        });
    });
}
