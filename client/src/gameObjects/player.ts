import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {

    public id: integer;
    public player_type: string;
    public speed: integer = 500;

    private text: Phaser.GameObjects.Text;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, playerInfo: any, player_type: any) {

        super(scene, playerInfo.position.x, playerInfo.position.y, 'race_car');

        this.id = playerInfo.id;
        this.player_type = player_type;

        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        //this.sprite = scene.add.sprite(playerInfo.position.x, playerInfo.position.y, 'race_car').setOrigin(0.5, 0.5);

        scene.add.existing(this);

        this.text = scene.add.text(playerInfo.position.x, playerInfo.position.y + 70, playerInfo.username, {
            font: '24px Calibri'
        }).setOrigin(0.5, 0.5);

        this.setTint(playerInfo.color);
        this.text.setTint(playerInfo.color);
    }


    update(time, delta): void {

        if (this.player_type == 'self') {
            
            this.setVelocity(0, 0);
            this.setAngularVelocity(0);

            if (this.keyW?.isDown) {

                if (this.keyA?.isDown) {
                    this.setAngularVelocity(-200);
                }

                if (this.keyD?.isDown) {
                    this.setAngularVelocity(200);
                }

                this.scene.physics.velocityFromAngle(this.angle - 90, this.speed, this.body.velocity)
            }

            if (this.keyS?.isDown) {

                if (this.keyA?.isDown) {
                    this.setAngularVelocity(-200);
                }

                if (this.keyD?.isDown) {
                    this.setAngularVelocity(200);
                }

                this.scene.physics.velocityFromAngle(this.angle + 90, this.speed, this.body.velocity)
            }

            this.text.setPosition(this.body.x + this.body.width / 2, this.body.y + this.body.height + 10);
        }
    }

    destroy() {
        this.text.destroy();
        this.destroy();
        super.destroy();
    }
}