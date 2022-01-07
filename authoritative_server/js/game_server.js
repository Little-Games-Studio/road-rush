const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    autoFocus: false,
    width: 1560,
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

function preload() {
    this.load.image('player', 'assets/player.png');
}

function create() {

    const self = this;
    this.players_physics_group = this.physics.add.group();

    const positions = [
        { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 - 200, y: this.cameras.main.height / 2 + 80 },
        { x: this.cameras.main.worldView.x + this.cameras.main.width / 2 + 200, y: this.cameras.main.height / 2 + 80 }
    ]

    io.on('connection', function (socket) {

        players[socket.id] = {
            id: socket.id
        };

        console.log('player', socket.id, 'connected to server, current players: ', Object.keys(players).length);

        socket.on('create-session', function (data) {

            if (!sessions[socket.id]) {

                var session = socket.id;
                sessions[session] = { max_players: data.number_of_players, players: [], positions: positions };
                
                players[socket.id].position = sessions[session].positions.shift();

                addPlayer(self, players[socket.id]);

                socket.join('session-' + session);

                players[socket.id].session = session;
                sessions[session].players.push(players[socket.id])

                console.log('player', socket.id, 'created a session');
                io.in('session-' + session).emit('message', 'session created');
                io.in('session-' + session).emit('currentPlayers', sessions[session].players);
            }
            else {
                console.log("Session already exists!")
            }
            
            console.log('current sessions:', sessions)
        })

        socket.on('join-session', function (session) {

            if (sessions[session] && sessions[session].players.length < sessions[session].max_players) {

                socket.join('session-' + session);

                players[socket.id].session = session;
                sessions[session].players.push(players[socket.id])

                players[socket.id].position = sessions[session].positions.shift();

                addPlayer(self, players[socket.id]);

                console.log('player', socket.id, 'joined session', session);
                io.in('session-' + session).emit('message', 'player ' + socket.id + ' joined session ' + session);
                io.in('session-' + session).emit('currentPlayers', sessions[session].players);
            }
        });

        socket.on('leave-session', function () {

            var session = players[socket.id].session;

            socket.leave('session-' + session);

            sessions[session].positions.push({ x: players[socket.id].position.x, y: players[socket.id].position.y });

            if (sessions[session]) {
                var index = sessions[session].players.indexOf(socket.id);
                sessions[session].players.splice(index, 1);

                if (sessions[session].players.length == 0) {
                    delete sessions[session]
                }
            }

            removePlayerFromPhysicsGroup(self, socket.id);
            delete players[socket.id];

            io.to('session-' + session).emit('message', 'player ' + socket.id + ' disconnected');
            io.to('session-' + session).emit('currentPlayers', players);
        });

        socket.on('disconnect', function () {

            console.log('player', socket.id, 'disconnected from server, current players: ', Object.keys(players).length);

            var session = players[socket.id].session;

            if (session) {
                var index = sessions[session].players.indexOf(socket.id);
                sessions[session].players.splice(index, 1);

                if (sessions[session].players.length == 0) {
                    delete sessions[session]
                }

                io.to('session-' + session).emit('message', 'player ' + socket.id + ' disconnected');
            }
            
            removePlayerFromPhysicsGroup(self, socket.id);
            delete players[socket.id];

            io.to('session-' + session).emit('message', 'player ' + socket.id + ' disconnected');
            io.to('session-' + session).emit('currentPlayers', players);
        });
    });
}

function update() { }

function addPlayer(self, playerInfo) {
    const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.id = playerInfo.id;
    self.players_physics_group.add(player);
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