import * as Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: true,
    key: 'CreateSessionScene'
};

export class CreateSessionScene extends Phaser.Scene {

    private createButton: any;
    private backButton: any;

    private gameManager: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        this.gameManager = this.plugins.get('GameManager');

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 150;

        const playersTitlePosition = menuTopPosition + 55;
        const playersButtonsPosition = playersTitlePosition + 50;

        const sessionTitlePosition = playersButtonsPosition + 70;
        const sessionIDPosition = sessionTitlePosition + 50;

        const createButtonPosition = sessionIDPosition + 70;
        const backButtonPosition = createButtonPosition + 50;

        var buttonStyle = {
            font: '28px Calibri',
            color: '#000',
            backgroundColor: '#797D81',
            padding: {
                left: 17,
                right: 17,
                top: 12,
                bottom: 12,
            }
        };

        this.add.text(screenCenterX, menuTopPosition, 'Create Session', { font: '48px Calibri' }).setOrigin(0.5);

        this.add.text(screenCenterX, playersTitlePosition, 'Players', { font: '24px Calibri' }).setOrigin(0.5);

        var onePlayerButton = this.add.text(screenCenterX - 150, playersButtonsPosition, "1", buttonStyle).setOrigin(0.5);
        onePlayerButton.setBackgroundColor('#fff');
        onePlayerButton.setInteractive();
        
        var twoPlayersButton = this.add.text(screenCenterX - 75, playersButtonsPosition, "2", buttonStyle).setOrigin(0.5);
        twoPlayersButton.setInteractive();

        var threePlayersButton = this.add.text(screenCenterX, playersButtonsPosition, "3", buttonStyle).setOrigin(0.5);
        threePlayersButton.setInteractive();

        var fourPlayersButton = this.add.text(screenCenterX + 75, playersButtonsPosition, "4", buttonStyle).setOrigin(0.5);
        fourPlayersButton.setInteractive();

        var fivePlayersButton = this.add.text(screenCenterX + 150, playersButtonsPosition, "5", buttonStyle).setOrigin(0.5);
        fivePlayersButton.setInteractive();

        this.add.text(screenCenterX, sessionTitlePosition, 'Share this session ID with your friends:', { font: '24px Calibri' }).setOrigin(0.5);

        var inputText = new InputText(this, screenCenterX, sessionIDPosition, 300, 40, { // x, y, width, height
            type: 'text',
            text: this.gameManager.socket.id,
            fontSize: '24px',
            fontFamily: 'Calibri',
            readOnly: true,
            color: '#000',
            backgroundColor: '#fff',
            align: 'center',
        }).setOrigin(0.5);
        this.add.existing(inputText);

        /* this.add.text(screenCenterX, sessionIDPosition, this.gameManager.socket.id, { font: '24px Calibri' }).setOrigin(0.5); */
        
        this.createButton = this.add.text(screenCenterX, createButtonPosition, "CREATE", { font: '28px Calibri' }).setOrigin(0.5);
        this.createButton.setInteractive();

        this.createButton.once('pointerup', () => {
            this.handleJoinClick();
        });

        this.backButton = this.add.text(screenCenterX, backButtonPosition, "BACK", { font: '28px Calibri' }).setOrigin(0.5);
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