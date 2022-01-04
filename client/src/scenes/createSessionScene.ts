import * as Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

import { io } from "socket.io-client";
import { GameScene } from './gameScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'CreateSessionScene'
};

export class CreateSessionScene extends Phaser.Scene {

    private gameScene: GameScene;
    private createButton: any;
    private backButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        this.gameScene = this.game.scene.getScene('GameScene') as GameScene;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Create Session', { font: '48px Calibri' }).setOrigin(0.5);

        this.add.text(screenCenterX, menuTopPosition + 55, 'Share this session ID with your friends: ', { font: '24px Calibri' }).setOrigin(0.5);

        this.add.text(screenCenterX, menuTopPosition + 85, this.gameScene.socket.id, { font: '24px Calibri' }).setOrigin(0.5);
        
        this.createButton = this.add.text(screenCenterX, menuTopPosition + 195, "JOIN", { font: '28px Calibri' }).setOrigin(0.5);
        this.createButton.setInteractive();

        this.createButton.once('pointerup', () => {
            this.handleJoinClick();
        });

        this.backButton = this.add.text(screenCenterX, menuTopPosition + 245, "BACK", { font: '28px Calibri' }).setOrigin(0.5);
        this.backButton.setInteractive();

        this.backButton.once('pointerup', () => {
            this.scene.start('MainMenuScene');
        });
    }

    handleJoinClick() {
        this.scene.start('GameScene');
    }
}