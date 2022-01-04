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

const max_players = 2;

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

        console.log('player', socket.id, ' connected', Object.keys(players).length);

        socket.on('join-session', function (session) {

            if (!sessions[session]) {
                sessions[session] = [ socket.id ];
            }
            else {
                sessions.push(socket.id);
            }

            console.log(sessions)

            // if no. of max players is not reached yet, create a new player and add it to our players object
            /* if (Object.keys(players).length < max_players) {
            
                socket.join(session);
                io.to(session).emit('message', 'player ' + socket.id + ' joined session ' + session);
    
                console.log('player', socket.id, 'connected');
    
                players[socket.id] = {
                    id: socket.id,
                    rotation: 0,
                    x: self.player_positions[0].x,
                    y: self.player_positions[0].y
                };
    
                self.player_positions.shift();
    
                // add player to server
                addPlayer(self, players[socket.id]);
                
                io.to("game room").emit('currentPlayers', players);
    
                socket.on('disconnect', function () {
    
                    console.log('player disconnected', socket.id);
    
                    // remove player from server
                    removePlayer(self, socket.id);
                    // remove this player from our players object
                    delete players[socket.id];
                    
                    io.to("game room").emit('currentPlayers', players);
                });
            }
            else {
                console.log('max players reached - player', socket.id, 'not connected');
    
                io.to(socket.id).emit('connectionRefused');
            } */
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