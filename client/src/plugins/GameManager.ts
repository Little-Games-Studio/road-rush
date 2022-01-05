import { io } from "socket.io-client";

export class GameManager extends Phaser.Plugins.BasePlugin {

    public socket: any;
    public username: string = '';

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        this.socket = io();

        this.socket.on("connect", () => {
            console.log("socket:", this.socket.id)
        });

    }
}