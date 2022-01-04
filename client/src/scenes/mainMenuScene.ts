import * as Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

import { GameScene } from './gameScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'MainMenuScene'
};

export class MainMenuScene extends Phaser.Scene {

    private gameScene: GameScene;
    private createSessionButton: any;
    private joinSessionButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        this.gameScene = this.game.scene.getScene('GameScene') as GameScene;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Main Menu', { font: '48px Calibri' }).setOrigin(0.5);

        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/inputtext/#style
        var inputText = new InputText(this, screenCenterX, menuTopPosition + 65, 400, 50, { // x, y, width, height
            type: 'text',
            text: this.gameScene.username,
            fontSize: '28px',
            maxLength: 10,
            minLength: 3,
            placeholder: 'Enter your name',
            align: 'center'
        })
            .setOrigin(0.5)
            .on('textchange', (inputText) => {
                this.gameScene.username = inputText.text;
                console.log(inputText.text)
                if (inputText.text.length > 2) {
                    this.activateButtons();
                }
                else {
                    this.deactivateButtons();
                }
            })
            .on('focus', (inputText) => {
                console.log('On focus');
                console.log(inputText.text)
                if (inputText.text.length > 2) {
                    this.activateButtons();
                }
            })
            .on('blur', function (inputText) {
                console.log('On blur');
            })
            .on('click', function (inputText) {
                console.log('On click');
            })
            .on('dblclick', function (inputText) {
                console.log('On dblclick');
            })

        this.add.existing(inputText);

        /* if (this.gameScene.username && this.gameScene.username.length > 2) {
            this.activateButtons();
        } */

        this.input.keyboard.on('keydown', (event) => {
            if (inputText.text.length < 10) {
                if (event.key == 'a') {
                    inputText.text += event.key;
                    this.gameScene.username = inputText.text;
                    if (inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 's') {
                    inputText.text += event.key;
                    this.gameScene.username = inputText.text;
                    if (inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 'd') {
                    inputText.text += event.key;
                    this.gameScene.username = inputText.text;
                    if (inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 'w') {
                    inputText.text += event.key;
                    this.gameScene.username = inputText.text;
                    if (inputText.text.length > 2) {
                        this.activateButtons();
                    }
                }
            }
        });

        /* this.startButton = this.add.text(screenCenterX, screenCenterY + 25, data.is_paused ? "RESUME" : "START", { font: '28px Arial' }).setOrigin(0.5);
        this.startButton.setInteractive(); */

        /* this.startButton.once('pointerup', () => {
            this.resumeGame();
        }); */

        this.createSessionButton = this.add.text(screenCenterX, screenCenterY + 25, "CREATE SESSION",
            {
                font: '28px Calibri',
                color: '#797D81',
            })
            .setOrigin(0.5);

        this.createSessionButton.once('pointerup', () => {
            this.scene.start('CreateSessionScene');
        });

        this.joinSessionButton = this.add.text(screenCenterX, screenCenterY + 75, "JOIN SESSION",
            {
                font: '28px Calibri',
                color: '#797D81',
            })
            .setOrigin(0.5);

        this.joinSessionButton.once('pointerup', () => {
            this.scene.start('JoinSessionScene');
        });

        inputText.setFocus();

        /* this.input.keyboard.once('keydown-ENTER', () => {
            this.resumeGame();
        }, this); */
    }

    activateButtons() {
        this.createSessionButton.setInteractive();
        this.createSessionButton.setColor('#fff');
        this.joinSessionButton.setInteractive();
        this.joinSessionButton.setColor('#fff');
    }

    deactivateButtons() {
        this.createSessionButton.disableInteractive();
        this.createSessionButton.setColor('#797D81');
        this.joinSessionButton.disableInteractive();
        this.joinSessionButton.setColor('#797D81');
    }
}