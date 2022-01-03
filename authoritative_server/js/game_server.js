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

const players = {};

function preload() {
    this.load.image('player', 'assets/player.png');
}

function create() {

    const self = this;
    this.players_physics_group = this.physics.add.group();

    this.player_positions = [
        { x: this.cameras.main.centerX - 200, y: this.cameras.main.height / 2 + 80 },
        { x: this.cameras.main.centerX + 900, y: this.cameras.main.height / 2 + 80 }
    ]

    io.on('connection', function (socket) {

        console.log('a player connected', socket.id, Object.keys(players).length);

        // if no. max players is not reached yet create a new player and add it to our players object
        if (Object.keys(players).length < max_players) {

            players[socket.id] = {
                id: socket.id,
                rotation: 0,
                x: self.player_positions[self.players_physics_group.getLength()].x,
                y: self.player_positions[self.players_physics_group.getLength()].y
            };

            // add player to server
            addPlayer(self, players[socket.id]);
            // send the players object to the new player
            socket.emit('currentPlayers', players);
            // update all other players of the new player
            socket.broadcast.emit('newPlayer', players[socket.id]);

            socket.on('disconnect', function () {

                console.log('player disconnected', socket.id);

                // remove player from server
                removePlayer(self, socket.id);
                // remove this player from our players object
                delete players[socket.id];
                // emit a message to all players to remove this player
                io.emit('disconnect-player', socket.id);
            });
        }
        else {
            console.log('max players reached - player', socket.id, 'not connected');
        }
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
            player.destroy();
        }
    });
}

const game = new Phaser.Game(config);

window.gameLoaded();