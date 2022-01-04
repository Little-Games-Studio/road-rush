import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'CreateSessionScene'
};

export class CreateSessionScene extends Phaser.Scene {

    private createButton: any;
    private backButton: any;

    private sessionManager: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Create Session', { font: '48px Calibri' }).setOrigin(0.5);

        this.add.text(screenCenterX, menuTopPosition + 55, 'Share this session ID with your friends: ', { font: '24px Calibri' }).setOrigin(0.5);

        this.sessionManager = this.plugins.get('SessionManager');

        this.add.text(screenCenterX, menuTopPosition + 85, this.sessionManager.socket.id, { font: '24px Calibri' }).setOrigin(0.5);
        
        this.createButton = this.add.text(screenCenterX, menuTopPosition + 135, "JOIN", { font: '28px Calibri' }).setOrigin(0.5);
        this.createButton.setInteractive();

        this.createButton.once('pointerup', () => {
            this.handleJoinClick();
        });

        this.backButton = this.add.text(screenCenterX, menuTopPosition + 185, "BACK", { font: '28px Calibri' }).setOrigin(0.5);
        this.backButton.setInteractive();

        this.backButton.once('pointerup', () => {
            this.scene.start('MainMenuScene');
        });
    }

    handleJoinClick() {
        /* this.gameScene.setSession(this.gameScene.socket.id);
        this.gameScene.socket.emit('join-session', this.gameScene.socket.id); */
        this.scene.sleep();
    }
}