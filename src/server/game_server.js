import Phaser from 'phaser'

import { MainServerScene } from './scenes/mainServerScene'

const config = {
    type: Phaser.HEADLESS,
    parent: 'game',
    autoFocus: false,
    width: 1600,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [MainServerScene]
};

const game = new Phaser.Game(config);

window.gameLoaded();