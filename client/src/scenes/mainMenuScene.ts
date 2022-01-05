import * as Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'MainMenuScene'
};

export class MainMenuScene extends Phaser.Scene {

    private gameManager: any;

    private createSessionButton: any;
    private joinSessionButton: any;

    /* private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key; */

    private inputText: any;

    constructor() {
        super(sceneConfig);
    }

    create(data: { is_paused: any; }): void {

        // KEYS
        /* this.keyW = this.input.keyboard.addKey('W');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D'); */

        this.gameManager = this.plugins.get('GameManager');

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuTopPosition = screenCenterY - 105;

        this.add.text(screenCenterX, menuTopPosition, 'Main Menu', { font: '48px Calibri' }).setOrigin(0.5);

        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/inputtext/#style
        this.inputText = new InputText(this, screenCenterX, menuTopPosition + 65, 400, 50, { // x, y, width, height
            type: 'text',
            text: this.gameManager.username,
            fontSize: '28px',
            maxLength: 10,
            minLength: 3,
            placeholder: 'Enter your name',
            align: 'center',
            border: 5,
            /* backgroundColor: '#fff', */
            borderColor: '#797D81',
        })
            .setOrigin(0.5)
            .on('textchange', (inputText) => {

                this.gameManager.username = inputText.text;

                if (inputText.text.length > 2) {
                    this.activateButtons();
                }
                else {
                    this.deactivateButtons();
                }
            })
            .on('focus', (inputText) => {
                /* console.log('On focus'); */
                if (inputText.text.length > 2) {
                    this.activateButtons();
                }
            })
            .on('blur', function (inputText) {
                /* console.log('On blur'); */
            })
            .on('click', function (inputText) {
                /* console.log('On click'); */
            })
            .on('dblclick', function (inputText) {
                /* console.log('On dblclick'); */
            })

        this.add.existing(this.inputText);

        /* this.input.keyboard.on('keydown', (event) => {
            if (this.inputText.text.length < 10) {
                if (event.key == 'a') {
                    this.inputText.text += event.key;
                    this.registry.set('username', this.inputText.text);
                    if (this.inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 's') {
                    this.inputText.text += event.key;
                    this.registry.set('username', this.inputText.text);
                    if (this.inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 'd') {
                    this.inputText.text += event.key;
                    this.registry.set('username', this.inputText.text);
                    if (this.inputText.text.length > 2) {
                        this.activateButtons();
                    }
                } else if (event.key == 'w') {
                    this.inputText.text += event.key;
                    this.registry.set('username', this.inputText.text);
                    if (this.inputText.text.length > 2) {
                        this.activateButtons();
                    }
                }
            }
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

        this.inputText.setFocus();
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