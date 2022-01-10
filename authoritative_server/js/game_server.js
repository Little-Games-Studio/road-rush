const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    autoFocus: false,
    width: 1600,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
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

function preload() {
    this.load.image('player', 'assets/player.png');
}

function create() {

    const self = this;
    const y_position = self.cameras.main.worldView.y + self.cameras.main.height / 2;

    this.players_physics_group = this.physics.add.group();

    io.on('connection', function (socket) {

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

        socket.on('create-session', function (data) {

            if (!sessions[socket.id]) {

                var session = socket.id;

                var session_positions = [];
                var session_colors = [];
                
                if (data.number_of_players == 1) {
                    session_positions = [
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2, y: y_position, angle: 0 }
                    ]

                    session_colors.push(colors[0])
                }
                
                if (data.number_of_players == 2) {
                    session_positions = [
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 150, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 150, y: y_position, angle: 180 }
                    ]

                    session_colors.push(colors[0])
                    session_colors.push(colors[1])
                }

                if (data.number_of_players == 3) {
                    session_positions = [
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 200, y: y_position, angle: 180 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 200, y: y_position, angle: 180 }
                    ]

                    session_colors.push(colors[0])
                    session_colors.push(colors[1])
                    session_colors.push(colors[2])
                }

                if (data.number_of_players == 4) {
                    session_positions = [
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 150, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 150, y: y_position, angle: 180 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 300, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 300, y: y_position, angle: 180 }
                    ]

                    session_colors.push(colors[0])
                    session_colors.push(colors[1])
                    session_colors.push(colors[2])
                    session_colors.push(colors[3])
                }
                    
                if (data.number_of_players == 5) {
                    session_positions = [
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 200, y: y_position, angle: 180 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 200, y: y_position, angle: 180 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 - 400, y: y_position, angle: 0 },
                        { x: self.cameras.main.worldView.x + self.cameras.main.width / 2 + 400, y: y_position, angle: 0 }
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

                addPlayerToSession(self, socket, session);
                addPlayerToPhysicsGroup(self, players[socket.id]);

                console.log('player', socket.id, 'created a session');
                io.in('session-' + session).emit('message', 'session created');
            }
            else {
                console.log("Session already exists!")
            }
            
            console.log('current sessions:', sessions)
        })

        socket.on('join-session', function (session) {

            if (sessions[session] && sessions[session].players.length < sessions[session].max_players) {

                addPlayerToSession(self, socket, session);
                addPlayerToPhysicsGroup(self, players[socket.id]);

                console.log('player', socket.id, 'joined session', session, 'as', players[socket.id].username);

                io.to(socket.id).emit('joined-session-success');

                io.in('session-' + session).emit('message', 'player ' + players[socket.id].username + ' joined session ' + session);
            }
            else {
                io.to(socket.id).emit('error', 'could not join session');
            }
        });

        socket.on('leave-session', function () {
            removePlayerFromSession(self, socket, 'player ' + socket.id + ' left the session');
            removePlayerFromPhysicsGroup(self, socket.id);
        });

        socket.on('disconnect', function () {
            removePlayerFromSession(self, socket, 'player ' + socket.id + ' disconnected')   
            removePlayerFromPhysicsGroup(self, socket.id);
            delete players[socket.id];

            console.log('player', socket.id, 'disconnected from server, current players: ', Object.keys(players).length);
        });

        socket.on('username', function (username) {
            players[socket.id].username = username;
        });

        // when a player moves, update the player data
        socket.on('playerInput', function (inputData) {
            players[socket.id].input = inputData;
        });
    });
}

function update() {

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

        io.emit('playerUpdates', sessions[players[player_physics.id].session].players);
    });
}

function addPlayerToSession(self, socket, session) {

    socket.join('session-' + session);

    players[socket.id].session = session;
    players[socket.id].position = sessions[session].positions.shift();
    players[socket.id].color = sessions[session].colors.shift();

    sessions[session].players.push(players[socket.id]);

    io.in('session-' + session).emit('currentPlayers', sessions[session].players);
}

function addPlayerToPhysicsGroup(self, playerInfo) {

    const newPlayerGameObject = self.physics.add.image(playerInfo.position.x, playerInfo.position.y, 'player')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(53, 40)
        .setAngle(playerInfo.position.angle);
    
    newPlayerGameObject.id = playerInfo.id;

    self.players_physics_group.add(newPlayerGameObject);
}

function removePlayerFromSession(self, socket, message) {

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

            io.to('session-' + session).emit('message', message);
            io.to('session-' + session).emit('currentPlayers', sessions[session].players);
        }

        console.log('player', socket.id, 'left session', session)
        console.log('current sessions:', sessions)
    }
}

function removePlayerFromPhysicsGroup(self, id) {
    self.players_physics_group.getChildren().forEach((player) => {
        if (id === player.id) {
            player.destroy();
        }
    });
}

const game = new Phaser.Game(config);

window.gameLoaded();