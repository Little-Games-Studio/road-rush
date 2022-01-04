import * as Phaser from 'phaser';

import { io } from "socket.io-client";
import { GameScene } from './gameScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'LeaveSessionScene'
};

export class LeaveSessionScene extends Phaser.Scene {

    private gameScene: GameScene;
    private yesButton: any;
    private noButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        this.gameScene = this.game.scene.getScene('GameScene') as GameScene;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Leave Session', { font: '48px Calibri' }).setOrigin(0.5);

        this.yesButton = this.add.text(screenCenterX - 100, menuTopPosition + 55, "YES", { font: '28px Calibri' }).setOrigin(0.5);
        this.yesButton.setInteractive();

        this.yesButton.once('pointerup', () => {
            this.handleYesClick();
        });

        this.noButton = this.add.text(screenCenterX + 100, menuTopPosition + 55, "NO", { font: '28px Calibri' }).setOrigin(0.5);
        this.noButton.setInteractive();

        this.noButton.once('pointerup', () => {
            this.handleNoClick();
        });
    }

    handleYesClick() {
        this.gameScene.setSession(null);
        this.gameScene.socket.emit('leave-session', this.gameScene.session);
        this.scene.sleep();
    }

    handleNoClick() {
        this.scene.sleep();
    }
}