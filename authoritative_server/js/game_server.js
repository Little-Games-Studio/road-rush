const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    autoFocus: false,
    width: 800,
    height: 600,
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
        { x: this.cameras.main.centerX - 200, y: this.cameras.main.height / 2 + 80 },
        { x: this.cameras.main.centerX + 900, y: this.cameras.main.height / 2 + 80 }
    ]

    this.player_positions = positions;

    io.on('connection', function (socket) {

        players[socket.id] = {
            id: socket.id
        };

        console.log('player', socket.id, 'connected to server, current players: ', Object.keys(players).length);

        socket.on('create-session', function (data) {

            if (!sessions[socket.id]) {

                var session = socket.id;
                sessions[session] = { max_players: data.number_of_players, players: [] };

                // create a new player and add it to our session object

                socket.join('session-' + session);

                players[socket.id].session = session;
                sessions[session].players.push(socket.id)

                console.log('player', socket.id, 'created a session');
                io.in('session-' + session).emit('message', 'session created');
            }
            else {
                console.log("Session already exists!")
            }
            
            console.log(sessions)
        })

        socket.on('join-session', function (session) {

            if (sessions[session] && sessions[session].players.length < sessions[session].max_players) {

                socket.join('session-' + session);

                players[socket.id].session = session;
                sessions[session].players.push(socket.id)

                console.log('player', socket.id, 'joined session', session);
                io.in('session-' + session).emit('message', 'player ' + socket.id + ' joined session ' + session);
            }      

            // if no. of max players is not reached yet, create a new player and add it to our session object
            /* if (Object.keys(players).length < max_players) {
            
                socket.join(session);
                io.to(session).emit('message', 'player ' + socket.id + ' joined session ' + session);
    
                console.log('player', socket.id, 'connected');
    
                
    
                self.player_positions.shift();
    
                // add player to server
                addPlayer(self, players[socket.id]);
                
                io.to("game room").emit('currentPlayers', players);
            }
            else {
                console.log('max players reached - player', socket.id, 'not connected');
    
                io.to(socket.id).emit('connectionRefused');
            } */
        });

        socket.on('leave-session', function () {

            var session = players[socket.id].session;

            socket.leave('session-' + session);

            if (sessions[session]) {
                var index = sessions[session].players.indexOf(socket.id);
                sessions[session].players.splice(index, 1);

                if (sessions[session].players.length == 0) {
                    delete sessions[session]
                }
            }

            console.log(sessions)
            io.to('session-' + session).emit('message', 'player ' + socket.id + ' disconnected');
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

                console.log(sessions)
                io.to(session).emit('message', 'player', socket.id, 'disconnected');
            }
            
            // remove player from physics group
            // removePlayer(self, socket.id);
            // remove this player from our players object
            delete players[socket.id];

            io.to(session).emit('currentPlayers', players);
        });
    });
}

function update() { }

function addPlayer(self, playerInfo) {
    const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.id = playerInfo.id;
    self.players_physics_group.add(player);
}

function removePlayer(self, id) {
    self.players_physics_group.getChildren().forEach((player) => {
        if (id === player.id) {
            self.player_positions.push({ x: player.x, y: player.y });
            player.destroy();
        }
    });
}

const game = new Phaser.Game(config);

window.gameLoaded();