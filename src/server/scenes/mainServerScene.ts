import * as Phaser from 'phaser';

import * as race_car from './../../assets/images/race_car.png'

import { Player } from './../gameObjects/player';

const sceneConfig = {
    active: false,
    visible: true,
    key: 'MainServerScene',
    physics: {
        arcade: {
            debug: process.env.ENV == 'development' ? true : false,
        }
    },
};

const sessions = {};
const players = {};
const colors = [
    0x1F85DE /* blue*/,
    0xF73F56 /* red */,
    0xDFCE46 /* yellow */,
    0x1FDE68 /* green */,
    0xAA5FE2 /* purple */
];
const collider_radius = 25;

export class MainServerScene extends Phaser.Scene {

    private players_physics_group;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('race_car', race_car);
    }

    create() {
        const y_position = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.players_physics_group = this.physics.add.group();
        // @ts-ignore
        io.on('connection', (socket) => {

            players[socket.id] = {
                id: socket.id,
                input: {
                    isRotatingLeft: false,
                    isRotatingRight: false,
                    isMovingForward: false,
                    isMovingBackwards: false
                }
            };

            console.log('player', socket.id, 'connected to server, current players: ', Object.keys(players).length);

            socket.on('create-session', (data) => {

                if (!sessions[socket.id]) {

                    var session = socket.id;

                    var session_positions = [];
                    var session_colors = [];

                    if (data.number_of_players == 1) {
                        session_positions = [
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2, y: y_position, angle: 0 }
                        ]

                        session_colors.push(colors[0])
                    }

                    if (data.number_of_players == 2) {
                        session_positions = [
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 150, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 150, y: y_position, angle: 180 }
                        ]

                        session_colors.push(colors[0])
                        session_colors.push(colors[1])
                    }

                    if (data.number_of_players == 3) {
                        session_positions = [
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 200, y: y_position, angle: 180 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 200, y: y_position, angle: 180 }
                        ]

                        session_colors.push(colors[0])
                        session_colors.push(colors[1])
                        session_colors.push(colors[2])
                    }

                    if (data.number_of_players == 4) {
                        session_positions = [
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 150, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 150, y: y_position, angle: 180 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 300, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 300, y: y_position, angle: 180 }
                        ]

                        session_colors.push(colors[0])
                        session_colors.push(colors[1])
                        session_colors.push(colors[2])
                        session_colors.push(colors[3])
                    }

                    if (data.number_of_players == 5) {
                        session_positions = [
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 200, y: y_position, angle: 180 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 200, y: y_position, angle: 180 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 400, y: y_position, angle: 0 },
                            { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 400, y: y_position, angle: 0 }
                        ]

                        session_colors.push(colors[0])
                        session_colors.push(colors[1])
                        session_colors.push(colors[2])
                        session_colors.push(colors[3])
                        session_colors.push(colors[4])
                    }

                    sessions[session] = {
                        max_players: data.number_of_players,
                        players: [],
                        positions: session_positions,
                        colors: session_colors
                    };

                    this.addPlayerToSession(socket, session);
                    this.addPlayerToPhysicsGroup(players[socket.id]);

                    console.log('player', socket.id, 'created a session');
                    // @ts-ignore
                    io.in('session-' + session).emit('message', 'session created');
                }
                else {
                    console.log("Session already exists!")
                }

                console.log('current sessions:', sessions)
            })

            socket.on('join-session', (session) => {

                if (sessions[session] && sessions[session].players.length < sessions[session].max_players) {

                    this.addPlayerToSession(socket, session);
                    this.addPlayerToPhysicsGroup(players[socket.id]);

                    console.log('player', socket.id, 'joined session', session, 'as', players[socket.id].username);
                    // @ts-ignore
                    io.to(socket.id).emit('joined-session-success');
                    // @ts-ignore
                    io.in('session-' + session).emit('message', 'player ' + players[socket.id].username + ' joined session ' + session);
                }
                else {
                    // @ts-ignore
                    io.to(socket.id).emit('error', 'could not join session');
                }
            });

            socket.on('leave-session', () => {
                this.removePlayerFromSession(socket, 'player ' + socket.id + ' left the session');
                this.removePlayerFromPhysicsGroup(socket.id);
            });

            socket.on('disconnect', () => {
                this.removePlayerFromSession(socket, 'player ' + socket.id + ' disconnected')
                this.removePlayerFromPhysicsGroup(socket.id);
                delete players[socket.id];

                console.log('player', socket.id, 'disconnected from server, current players: ', Object.keys(players).length);
            });

            socket.on('username', (username) => {
                players[socket.id].username = username;
            });

            // when a player moves, update the player data
            socket.on('playerInput', (inputData) => {
                players[socket.id].input = inputData;
            });
        });
    }

    update(time, delta) {

        this.players_physics_group.getChildren().forEach((player_physics) => {

            const input = players[player_physics.id].input;

            player_physics.setVelocity(0, 0);
            player_physics.setAngularVelocity(0);
            player_physics.setAcceleration(0);

            if (input.isMovingForward) {

                if (input.isRotatingLeft) {
                    player_physics.setAngularVelocity(-200);
                }
                else if (input.isRotatingRight) {
                    player_physics.setAngularVelocity(200);
                }

                this.physics.velocityFromAngle(player_physics.angle - 90, 500, player_physics.body.velocity)
            }
            else if (input.isMovingBackwards) {

                if (input.isRotatingLeft) {
                    player_physics.setAngularVelocity(-200);
                }
                else if (input.isRotatingRight) {
                    player_physics.setAngularVelocity(200);
                }

                this.physics.velocityFromAngle(player_physics.angle + 90, 500, player_physics.body.velocity)
            }

            players[player_physics.id].position.x = player_physics.body.x;
            players[player_physics.id].position.y = player_physics.body.y;
            players[player_physics.id].rotation = player_physics.body.rotation;
            players[player_physics.id].angle = player_physics.angle;
            players[player_physics.id].velocity = player_physics.body.velocity * input.delta;

            this.physics.world.wrap(this.players_physics_group, 5);
            // @ts-ignore
            io.emit('playerUpdates', sessions[players[player_physics.id].session].players);
        });
    }

    addPlayerToSession(socket, session) {

        socket.join('session-' + session);

        players[socket.id].session = session;
        players[socket.id].position = sessions[session].positions.shift();
        players[socket.id].color = sessions[session].colors.shift();
        players[socket.id].collider_radius = collider_radius;

        sessions[session].players.push(players[socket.id]);
        // @ts-ignore
        io.in('session-' + session).emit('currentPlayers', sessions[session].players);
    }

    addPlayerToPhysicsGroup(playerInfo) {

        const player = new Player(this, playerInfo);

        player
            .setOrigin(0.5, 0.5)
            .setDisplaySize(53, 40)
            .setAngle(playerInfo.position.angle);

        this.players_physics_group.add(player);
    }

    removePlayerFromSession(socket, message) {

        var session = players[socket.id].session;

        if (session) {

            socket.leave('session-' + session);

            var index = sessions[session].players.indexOf(socket.id);
            sessions[session].players.splice(index, 1);

            if (sessions[session].players.length == 0) {
                delete sessions[session]
            }
            else {
                sessions[session].positions.push({ x: players[socket.id].position.x, y: players[socket.id].position.y });
                sessions[session].colors.push(players[socket.id].color);
                // @ts-ignore
                io.to('session-' + session).emit('message', message);
                // @ts-ignore
                io.to('session-' + session).emit('currentPlayers', sessions[session].players);
            }

            console.log('player', socket.id, 'left session', session)
            console.log('current sessions:', sessions)
        }
    }

    removePlayerFromPhysicsGroup(id) {
        this.players_physics_group.getChildren().forEach((player) => {
            if (id === player.id) {
                player.destroy();
            }
        });
    }
}