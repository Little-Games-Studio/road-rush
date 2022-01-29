import * as Phaser from 'phaser';

import { io } from "socket.io-client";
import { PlayerInfo } from '../../shared/player_utils';
import { Player } from '../gameObjects/local_player';

export class GameManager extends Phaser.Plugins.BasePlugin {

    public socket: any;
    public session: any;
    public amount_of_players: integer = 2;
    public player: Player;
    public playerInfos: [PlayerInfo];
    public eventEmitter: Phaser.Events.EventEmitter;

    private username: string = '';

    constructor(pluginManager) {
        super(pluginManager);

        this.eventEmitter = new Phaser.Events.EventEmitter();
    }

    start() {

        this.username = localStorage.getItem('username');

        this.socket = io();

        this.socket.on("connect", () => {

            console.log("socket:", this.socket.id)

            this.socket.on("message", (message: string) => {
                console.log("server message:", message)
            });

            this.socket.on('error', () => {
                console.error('ERROR: could not join session');
            });

            this.socket.on('currentPlayers', (playerInfos: [PlayerInfo]) => {

                this.playerInfos = playerInfos;
                console.log("gameManager - current player infos:", this.playerInfos);

                this.eventEmitter.emit('player_info_update');
            }); 
        });
    }

    sendUsernameToServer() {
        this.socket.emit("username", this.username);
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
        localStorage.setItem('username', this.username);
    }
}