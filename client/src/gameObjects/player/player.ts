import * as Phaser from 'phaser';

export class Player extends Phaser.GameObjects.GameObject {

    public id: integer;

    private sprite: Phaser.GameObjects.Sprite;
    private text: Phaser.GameObjects.Text;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, playerInfo: any, player_type: any) {

        super(scene, 'Player');

        this.id = playerInfo.id;

        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyS = this.scene.input.keyboard.addKey('S');

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.sprite = scene.add.sprite(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5);
        this.text = scene.add.text(playerInfo.x, playerInfo.y + 70, playerInfo.id).setOrigin(0.5, 0.5);

        if (player_type === 'self') {
            this.sprite.setTint(0x1498C4);
            this.text.setTint(0x1498C4);
        }  
        else { // red
            this.sprite.setTint(0xD31616);
            this.text.setTint(0xD31616);
        }   
    }


    update(time, delta): void {

    }

    destroy() {
        this.sprite.destroy();
        this.text.destroy();
        super.destroy();
    }
}