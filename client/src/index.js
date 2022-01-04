import './index.css'

import Phaser from 'phaser'

import { GameScene } from './scenes/gameScene'
import { MainMenuScene } from './scenes/mainMenuScene'
import { CreateSessionScene } from './scenes/createSessionScene'
import { JoinSessionScene } from './scenes/JoinSessionScene'
import { LeaveSessionScene } from './scenes/LeaveSessionScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

import { io } from "socket.io-client";

class SessionManager extends Phaser.Plugins.BasePlugin {

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
                key: 'SessionManager',
                plugin: SessionManager,
                start: true,
                mapping: 'sessionManager'     // member name in each scene instance
            }
        ]
    }
};

const game = new Phaser.Game(config);


