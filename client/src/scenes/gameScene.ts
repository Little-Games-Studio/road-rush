import * as Phaser from 'phaser';
import { io } from "socket.io-client";

import * as background_img from './../assets/images/background/road.png'
//import * as racing_mp3 from './../assets/audio/racing.mp3'
import * as race_car from './../assets/images/race_car.png'

import { Player } from '../gameObjects/player/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'GameScene',
    physics: {
        arcade: {
            debug: true,
        },
        matter: {
            debug: true,
            gravity: false
        }
    },
};

export class GameScene extends Phaser.Scene {

    public player: Player;
    private socket: any;
    private players: any;

    private music: any;

    constructor() {
        super(sceneConfig);
    }

    preload(): void {
        this.load.image('background_img', background_img);
        this.load.image('player', race_car);
        //this.load.audio('music', [music]);
    }

    create(): void {

        this.socket = io();
        this.players = this.add.group();

        this.socket.on('currentPlayers', (players) => {

            console.log("socket:", this.socket.id)

            this.players.getChildren().forEach((player) => {
                console.log("currentPlayers 1 - player:", player.id);
            });

            this.players.clear(true, true)

            this.players.getChildren().forEach((player) => {
                console.log("currentPlayers 3 - player:", player.id);
            });

            Object.keys(players).forEach((id) => {
                
                if (players[id].id === this.socket.id) {
                    this.displayPlayer(players[id], 'self');
                }
                else {
                    this.displayPlayer(players[id], 'enemy');
                }
            });

            this.players.getChildren().forEach((player) => {
                console.log("currentPlayers 4 - player:", player.id);
            });
        });

        this.socket.on('newPlayer', (playerInfo) => {
            console.log('newPlayer - player connected', playerInfo.id);
            this.displayPlayer(playerInfo, 'enemy');
            this.players.getChildren().forEach((player) => {
                console.log("newPlayer - currentPlayers - player:", player.id);
            });
        });

        this.socket.on('max-players-reached', () => {
            console.log('max players reached - player NOT connected');
        });

        this.socket.on('disconnect-player', (playerId) => {

            console.log('disconnect-player - player disconnected', playerId);

            this.players.getChildren().forEach((player) => {
                if (playerId === player.id) {
                    this.players.remove(player);
                    player.destroy();
                }
            });

            this.players.getChildren().forEach((player) => {
                console.log("disconnect-player - current player:", player.id);
            });
        });

        //this.music = this.sound.add('music');
        //this.music.loop = true;


        /* this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause('GameScene');
            this.scene.launch('MainMenuScene', { is_paused: true });
        }, this);

        this.events.on('pause', () => {
           // this.music.pause();
            console.log('Game paused');
        })

        this.events.on('resume', () => {
         //   this.music.resume();
            console.log('Game resumed');
        })

       // this.music.pause();
        this.scene.pause('GameScene'); */
    }

    update(time, delta): void {

        //this.player.update(time, delta);
    }

    displayPlayer(playerInfo, playerType) {

        const player = new Player(this, playerInfo, playerType);
        this.players.add(player);
    }
}