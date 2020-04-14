import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import history from 'connect-history-api-fallback';
import crypto from 'crypto';

import mysql = require('./../modules/mysql');

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

app.use(history());
app.use(express.static('public'));

const nBytes: number = 4;

const echo = (elm: any) => console.log(elm); 

function secureRandom(max: number): number {
    const randomBytes: Buffer = crypto.randomBytes(nBytes);

    const r: number = randomBytes.readUIntBE(0, nBytes);

    return r % max;
}



function setSeats(id: number): Promise<number> {
    return new Promise(function (resolve, reject) {
        mysql.searchId(id).then(function (position: any) {
            // already have a seat
            if (position.length != 0) {
                resolve(position[0].position);
            }
            // dont have seat
            else {
                mysql.searchEmpty().then(function (list: any) {
                    list = JSON.parse(JSON.stringify(list));
                    resolve(list[secureRandom(list.length)].position);
                });
            }
        });
    });
}

io.on('connection', (socket: socketio.Socket) => {
    function send_all_seats(): void {
        mysql.getPositionList().then(function (positionList: any) {
            io.emit('positionList', positionList);
        });
    }

    send_all_seats();
    // Login to admin page
    socket.on('login', (id: string, password: string) => {
        mysql.login(id).then(function (user: any) {
            if (user.length != 0) {
                if (password == user[0].password) {
                    socket.emit('login-success', user[0].name);
                    send_all_seats();
                }
                else {
                    socket.emit('login-failed', 101);
                }
            } else {
                socket.emit('login-failed', 102);
            }
        }).catch(function (err: any) {
            socket.emit('login-failed', 103);
            console.log(err);
        })
    });

    socket.on('send_id', (id) => {
        mysql.getName(id).then(function (name: any) {
            setSeats(id).then(function (position: number) {
                const ret = {
                    position: position,
                    id: id,
                    name: name[0].name
                };
                socket.emit('set_seat', position);
                io.emit('new_seat', ret);
                mysql.setSeat(ret);
            });
        });
    });

    // admin commands
    socket.on('command-swap', (type) => {
        mysql.swap(type.select1, type.select2).then(function () {
            send_all_seats();
        })
    });

    socket.on('command-reserve', (type) => {
        mysql.getName(type.select2).then(function (name: any) {
            mysql.searchId(type.select2).then(function (position: any) {
                // already have a seat
                if (position.length == 0) {
                    const ret = {
                        position: type.select1,
                        id: type.select2,
                        name: name[0].name
                    };
                    io.emit('new_seat', ret);
                    mysql.setSeat(ret);
                }
            });
        });
    });

    socket.on('command-cancel', (type) => {
        mysql.cancel(type.select1).then(function () {
            send_all_seats();
        })
    });

    socket.on('command-reset', (type) => {
        mysql.reset().then(function () {
            send_all_seats();
        })
    });
})

const PORT: number = 3000;
server.listen(PORT, () => {
    echo('Listening on port: ' + PORT);
});