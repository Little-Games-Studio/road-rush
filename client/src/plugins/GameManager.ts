import * as Phaser from 'phaser';
import { io } from "socket.io-client";

export class GameManager extends Phaser.Plugins.BasePlugin {

    public socket: any;
    public session: any;
    public username: string = '';
    public amount_of_players: integer;

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
        });
    }
}