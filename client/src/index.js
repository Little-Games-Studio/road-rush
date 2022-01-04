import './index.css'

import Phaser from 'phaser'

import { MainMenuScene } from './scenes/mainMenuScene'
import { GameScene } from './scenes/gameScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

var config = {
    type: Phaser.AUTO,
    width: 1560,
    height: 768,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#373839',
    audio: {
        disableWebAudio: true
    },
    scene: [GameScene, HUDScene, MainMenuScene, GameOverScene ]
};

var game = new Phaser.Game(config);