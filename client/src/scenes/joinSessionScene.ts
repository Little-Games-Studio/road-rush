import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'JoinSessionScene'
};

export class JoinSessionScene extends Phaser.Scene {

    private joinButton: any;
    private backButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.text(screenCenterX, screenCenterY - 45, 'Join Session', { font: '48px Calibri' }).setOrigin(0.5);

        this.joinButton = this.add.text(screenCenterX, screenCenterY + 25, "JOIN", { font: '28px Calibri' }).setOrigin(0.5);
        this.joinButton.setInteractive();

        this.joinButton.once('pointerup', () => {
            //this.resumeGame();
        });

        this.backButton = this.add.text(screenCenterX, screenCenterY + 75, "BACK", { font: '28px Calibri' }).setOrigin(0.5);
        this.backButton.setInteractive();

        this.backButton.once('pointerup', () => {
            this.scene.start('MainMenuScene');
        });
    }
}