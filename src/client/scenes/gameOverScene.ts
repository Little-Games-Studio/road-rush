import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverScene',
};

export class GameOverScene extends Phaser.Scene {

    private gameManager: any;
    private restartButton: any;
    private backButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(): void {
        console.log('Game-Over Scene launched.');

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Game Over', { font: '48px Calibri' }).setOrigin(0.5);

        this.restartButton = this.add.text(screenCenterX, menuTopPosition + 65, 'RESTART', { font: '28px Arial' }).setOrigin(0.5);
        this.restartButton.setInteractive();
        
        /* this.restartButton.once('pointerup', () => {

            this.gameManager.socket.emit('restart', {
                isRotatingLeft: this.isRotatingLeft,
                isRotatingRight: this.isRotatingRight,
                isMovingForward: this.isMovingForward,
                isMovingBackwards: this.isMovingBackwards
            });

            this.scene.setVisible(false);
        }); */

        this.backButton = this.add.text(screenCenterX, menuTopPosition + 130, 'LEAVE SESSION', { font: '28px Arial' }).setOrigin(0.5);
        this.backButton.setInteractive();

        this.backButton.once('pointerup', () => {
            this.scene.get('MainMenu').scene.start();
        });
    }
}