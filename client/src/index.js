import './index.css'

import Phaser from 'phaser'

import { MainMenuScene } from './scenes/mainMenuScene'
import { CreateSessionScene } from './scenes/createSessionScene'
import { JoinSessionScene } from './scenes/JoinSessionScene'
import { GameScene } from './scenes/gameScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

var config = {
    parent: "game",
    type: Phaser.AUTO,
    width: 1560,
    height: 768,
    backgroundColor: '#373839',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    audio: {
        disableWebAudio: true
    },
    scene: [
        GameScene,
        MainMenuScene,
        CreateSessionScene,
        JoinSessionScene
    ]
};

var game = new Phaser.Game(config);