import * as Phaser from 'phaser';

import * as race_car from './../../assets/images/race_car.png'

import { Player } from '../gameObjects/server_player';

const sceneConfig = {
    active: false,
    visible: true,
    key: 'MainServerScene',
    physics: {
        default: 'matter',
        arcade: {
            debug: process.env.ENV == 'development' ? true : false,
        },
        matter: {
            debug: process.env.ENV == 'development' ? true : false,
            gravity: false
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

const acceleration = 0.1;
const staticFriction = 1;

export class MainServerScene extends Phaser.Scene {

    private player_game_objects: any[];
    private non_colliding_group;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('race_car', race_car);
    }

    create() {

        this.non_colliding_group = this.matter.world.nextGroup(true);

        // world_bound_top
        this.matter.add.rectangle(this.cameras.main.centerX, 0, this.cameras.main.width, 1, {
            isSensor: false,
            isStatic: true
        });

        // world_bound_bottom
        this.matter.add.rectangle(this.cameras.main.centerX, this.cameras.main.height, this.cameras.main.width, 1, {
            isSensor: false,
            isStatic: true
        });

        // world_bound_left
        this.matter.add.rectangle(0, this.cameras.main.centerY, 1, this.cameras.main.height, {
            isSensor: false,
            isStatic: true
        });

        // world_bound_right
        this.matter.add.rectangle(this.cameras.main.width, this.cameras.main.centerY, 1, this.cameras.main.height, {
            isSensor: false,
            isStatic: true
        });

        const y_position = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.player_game_objects = [];

        // @ts-ignore
        io.on('connection', (socket) => {

            players[socket.id] = {
                id: socket.id,
                health: 100,
                max_speed: 10,
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
                        colors: session_colors,
                        collision_group: this.matter.world.nextGroup(),
                        collision_category: this.matter.world.nextCategory()
                    };

                    this.addPlayerToSession(socket, session);
                    this.addPlayerToPhysicsGroup(players[socket.id], sessions[session].collision_group);

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
                    this.addPlayerToPhysicsGroup(players[socket.id], sessions[session].collision_group);

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
            });

            socket.on('disconnect', () => {
                this.removePlayerFromSession(socket, 'player ' + socket.id + ' disconnected')
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

        this.player_game_objects.forEach((player_physics: Player) => {

            // handle speed change
            const input = players[player_physics.id].input;

            if (player_physics.health > 0) {

                if (input.isMovingForward) {
                    if (player_physics.speed < players[player_physics.id].max_speed) {
                        player_physics.speed += acceleration;
                    }
                }

                if (input.isMovingBackwards) {
                    if (player_physics.speed > -players[player_physics.id].max_speed) {
                        player_physics.speed -= acceleration;
                    }
                }
            }

            // if player is colliding with something or not moving
            if ((!input.isMovingForward && !input.isMovingBackwards)) {
                if (player_physics.speed > 0) {
                    if (player_physics.speed - player_physics.speed * acceleration > 0.01)
                        player_physics.speed -= player_physics.speed * acceleration;
                    else
                        player_physics.speed = 0;
                }
                else if (player_physics.speed < 0) {
                    if (player_physics.speed + player_physics.speed * -acceleration < -0.01)
                        player_physics.speed += player_physics.speed * -acceleration;
                    else
                        player_physics.speed = 0;
                }
            }

            // handle rotation change
            var rotation = 0;

            if (player_physics.speed != 0) {

                if (input.isRotatingRight && player_physics.rotation_speed < player_physics.max_rotation_speed) {
                    player_physics.rotation_speed++;
                }
                else if (input.isRotatingLeft && player_physics.rotation_speed > -player_physics.max_rotation_speed) {
                    player_physics.rotation_speed--;
                }
                else {
                    if (player_physics.rotation_speed > 0)
                        player_physics.rotation_speed -= 0.4;
                    else if (player_physics.rotation_speed < 0)
                        player_physics.rotation_speed += 0.4;
                }
            }

            rotation += player_physics.rotation_speed / 100;
            
            //if we have enough power, allow movement
            /* if (player_physics.speed > staticFriction) { */
                player_physics.setAngularVelocity(rotation * player_physics.speed/10);

                player_physics.setVelocityX(Math.sin(player_physics.rotation) * player_physics.speed);
                player_physics.setVelocityY(-Math.cos(player_physics.rotation) * player_physics.speed);
            /* } */

            players[player_physics.id].position.x = player_physics.x;
            players[player_physics.id].position.y = player_physics.y;
            players[player_physics.id].rotation = player_physics.rotation;
            players[player_physics.id].angle = player_physics.angle;
            players[player_physics.id].health = player_physics.health;

            //this.physics.world.wrap(this.players_physics_group, 5);
            // @ts-ignore
            io.emit('playerUpdates', sessions[players[player_physics.id].session].players);
        });
    }

    addPlayerToSession(socket, session) {

        socket.join('session-' + session);

        players[socket.id].session = session;
        players[socket.id].position = sessions[session].positions.shift();
        players[socket.id].color = sessions[session].colors.shift();

        sessions[session].players.push(players[socket.id]);

        players[socket.id].hud_text_y_position = 30 * sessions[session].players.length;
        // @ts-ignore
        io.in('session-' + session).emit('currentPlayers', sessions[session].players);
    }

    addPlayerToPhysicsGroup(playerInfo, collision_group: number) {

        var new_player = new Player(this, playerInfo, this.non_colliding_group);

        new_player
            .setAngle(playerInfo.position.angle)
            .setBounce(0.5);
        
        this.player_game_objects.push(new_player);
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

        this.removePlayerFromPhysicsGroup(socket.id);

        delete players[socket.id];
    }

    removePlayerFromPhysicsGroup(id) {

        var index = -1;

        this.player_game_objects.forEach((player) => {

            if (id === player.id) {
                index = this.player_game_objects.indexOf(player);
                this.matter.world.remove(player);
                player.destroy();
            }
        });

        if (index > -1) {
            this.player_game_objects.splice(index, 1);
        }
    }
}