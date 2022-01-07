import * as Phaser from 'phaser';

import { GameScene } from './../scenes/gameScene';

import { io } from "socket.io-client";

export class GameManager extends Phaser.Plugins.BasePlugin {

    private myGame: GameScene;

    public socket: any;
    public session: any;
    public username: string = '';
    public amount_of_players: integer;
    public players: any;

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {

        this.socket = io();

        this.socket.on("connect", () => {

            console.log("socket:", this.socket.id)

            this.socket.on("message", (message) => {
                console.log("server message:", message)
            });

            this.socket.on('currentPlayers', (players) => {
                this.players = players;
                console.log("gameManager - current players:", this.players);
            });
        });
    }
}