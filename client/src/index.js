import './index.css'

import Phaser from 'phaser'

import { GameScene } from './scenes/gameScene'
import { MainMenuScene } from './scenes/mainMenuScene'
import { CreateSessionScene } from './scenes/createSessionScene'
import { JoinSessionScene } from './scenes/JoinSessionScene'
import { LeaveSessionScene } from './scenes/LeaveSessionScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

import { GameManager } from './plugins/GameManager'

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
        MainMenuScene,
        CreateSessionScene,
        JoinSessionScene,
        LeaveSessionScene,
        GameScene
    ],
    plugins: {
        global: [
            {
                key: 'GameManager',
                plugin: GameManager,
                start: true,
                mapping: 'gameManager'
            }
        ]
    }
};

const game = new Phaser.Game(config);


