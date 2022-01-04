import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'MainMenuScene'
};

export class MainMenuScene extends Phaser.Scene {

    private startButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.text(screenCenterX, screenCenterY - 25, 'Main Menu', { font: '28px Arial' }).setOrigin(0.5);

        this.startButton = this.add.text(screenCenterX, screenCenterY + 25, data.is_paused ? "RESUME" : "START", { font: '28px Arial' }).setOrigin(0.5);
        this.startButton.setInteractive();

        this.startButton.once('pointerup', () => {
            this.resumeGame();
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.resumeGame();
        }, this);
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.setVisible(false);
        this.scene.pause('MainMenuScene');
    }
}