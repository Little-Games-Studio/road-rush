import * as Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

import * as road from './../../assets/images/background/road.png'
//import * as racing_mp3 from './../assets/audio/racing.mp3'
import * as race_car from './../../assets/images/race_car.png'

import { Player } from '../gameObjects/local_player';
import { PlayerInfo } from '../../shared/player_utils';
import { GameManager } from '../plugins/GameManager';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'GameScene',
    physics: {
        default: 'matter',
        arcade: {
            debug: process.env.ENV == 'development' ? true: false,
        },
        matter: {
            debug: process.env.ENV == 'development' ? true : false,
            gravity: false
        }
    },
};

export class GameScene extends Phaser.Scene {

    //public player: Player;

    private gameManager: GameManager;
    private players: any[];

    public road: Phaser.GameObjects.TileSprite;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private isRotatingLeft: boolean = false;
    private isRotatingRight: boolean = false;
    private isMovingForward: boolean = false;
    private isMovingBackwards: boolean = false;

    private music: any;

    constructor() {
        super(sceneConfig);
    }

    preload(): void {
        /* this.load.image('road', road); */
        this.load.image('race_car', race_car);
        //this.load.audio('music', [music]);
    }

    create(): void {

        this.gameManager = this.plugins.get('GameManager') as GameManager;

        // KEYS
        this.keyW = this.input.keyboard.addKey('W');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.players = [];

        /* const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2; */

        /* this.road = this.add.tileSprite(0, 0, 1600, 768, 'road').setOrigin(0); */

        this.add.text(30, this.cameras.main.height - 40, 'Session:', { font: '22px Calibri' });

        var inputText = new InputText(this, 260, this.cameras.main.height - 28, 300, 30, { // x, y, width, height
            type: 'text',
            text: this.gameManager.session,
            fontSize: '22px',
            fontFamily: 'Calibri',
            readOnly: true,
            align: 'left',
        });

        this.add.existing(inputText);

        Object.keys(this.gameManager.playerInfos).forEach((id) => {
            this.displayPlayer(this.gameManager.playerInfos[id]);
        });

        this.gameManager.eventEmitter.on('player_info_update', () => {

            this.players.forEach((player) => {
                player.destroy();
            });

            this.players = [];

            Object.keys(this.gameManager.playerInfos).forEach((id) => {
                this.displayPlayer(this.gameManager.playerInfos[id]);
            });
        });

        this.gameManager.socket.on('playerUpdates', (players) => {
            Object.keys(players).forEach((id) => {
                this.players.forEach((player: Player) => {
                    if (players[id].id === player.id) {
                        player.setPosition(players[id].position.x, players[id].position.y);
                        player.setAngle(players[id].position.angle);
                        player.health = players[id].health;
                    }
                });
            });
        });

        this.gameManager.socket.on('winner', (playerInfo: PlayerInfo) => {

            console.log('winner', playerInfo)
            this.scene.launch('GameOverScene');
        });

        //this.music = this.sound.add('music');
        //this.music.loop = true;


        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause('GameScene');
            this.scene.launch('LeaveSessionScene');
        }, this);
/*
        this.events.on('pause', () => {
           // this.music.pause();
            console.log('Game paused');
        })

        this.events.on('resume', () => {
         //   this.music.resume();
            console.log('Game resumed');
        })*/

        /* this.music.pause(); */
    }

    update(time, delta): void {

        const wasRotatingLeft = this.isRotatingLeft;
        const wasRotatingRight = this.isRotatingRight;
        const wasMovingForward = this.isMovingForward;
        const wasMovingBackwards = this.isMovingBackwards;

        if (this.keyA?.isDown || this.cursors.left.isDown) {
            this.isRotatingLeft = true;
        }
        else {
            this.isRotatingLeft = false;
        }

        if (this.keyD?.isDown || this.cursors.right.isDown) {
            this.isRotatingRight = true;
        }
        else {
            this.isRotatingRight = false;
        }

        if (this.keyW?.isDown || this.cursors.up.isDown) {
            this.isMovingForward = true;
        }
        else {
            this.isMovingForward = false; 
        }

        if (this.keyS?.isDown || this.cursors.down.isDown) {
            this.isMovingBackwards = true;
        }
        else {
            this.isMovingBackwards = false;
        }

        if (
            wasRotatingLeft !== this.isRotatingLeft ||
            wasRotatingRight !== this.isRotatingRight ||
            wasMovingForward !== this.isMovingForward ||
            wasMovingBackwards !== this.isMovingBackwards
        ) {
            this.gameManager.socket.emit('playerInput', {
                delta: delta,
                isRotatingLeft: this.isRotatingLeft,
                isRotatingRight: this.isRotatingRight,
                isMovingForward: this.isMovingForward,
                isMovingBackwards: this.isMovingBackwards
            });
        }

        //console.log(this.speed)

        this.players.forEach(player => {
            player.update();
        });
    }

    displayPlayer(playerInfo) {
        const player = new Player(this, playerInfo);
        this.players.push(player);
    }
}