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

    private collider_radius: integer = 25;
    private collider_front;
    private collider_center;
    private collider_back;

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

        scene.add.existing(this);

        this.collider_front = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y - 25, '');
        this.collider_front.visible = false;
        this.collider_front.body.setCircle(this.collider_radius, -8, -8);
        this.collider_front.setDebugBodyColor(0xffff00);

        this.collider_center = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y, '');
        this.collider_center.visible = false;
        this.collider_center.body.setCircle(this.collider_radius, -8, -8);
        this.collider_center.setDebugBodyColor(0xffff00);

        this.collider_back = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y + 25, '');
        this.collider_back.visible = false;
        this.collider_back.body.setCircle(this.collider_radius, -8, -8);
        this.collider_back.setDebugBodyColor(0xffff00);

        this.text = scene.add.text(playerInfo.position.x, playerInfo.position.y + 70, playerInfo.username, {
            font: '24px Calibri'
        }).setOrigin(0.5, 0.5);

        this.setTint(playerInfo.color);
        this.text.setTint(playerInfo.color);
    }

    create() {
        this.centerBodyOnXY(this.collider_front.body, this.body.x + this.body.halfWidth, this.body.y + this.collider_radius);
        this.centerBodyOnBody(this.collider_center.body, this.body);
        this.centerBodyOnXY(this.collider_back.body, this.body.x + this.body.halfWidth, this.body.y + this.body.height - this.collider_radius);

        /* this.physics.add.collider(asteroid, [s1, s2, s3], function (_asteroid, shipComponent) {
            var v = shipComponent.body.velocity;

            ship.body.velocity.copy(v);
            s1.body.velocity.copy(v);
            s2.body.velocity.copy(v);
            s3.body.velocity.copy(v);
        }); */
    }

    update(time, delta): void {

        if (this.player_type == 'self') {
            
            this.setVelocity(0, 0);
            this.setAngularVelocity(0);

            if (this.keyW?.isDown || this.cursors.up.isDown) {

                if (this.keyA?.isDown || this.cursors.left.isDown) {
                    this.setAngularVelocity(-200);
                }

                if (this.keyD?.isDown || this.cursors.right.isDown) {
                    this.setAngularVelocity(200);
                }

                this.scene.physics.velocityFromAngle(this.angle - 90, this.speed, this.body.velocity)
            }

            if (this.keyS?.isDown || this.cursors.down.isDown) {

                if (this.keyA?.isDown || this.cursors.left.isDown) {
                    this.setAngularVelocity(-200);
                }

                if (this.keyD?.isDown || this.cursors.right.isDown) {
                    this.setAngularVelocity(200);
                }

                this.scene.physics.velocityFromAngle(this.angle + 90, this.speed, this.body.velocity)
            }

            this.text.setPosition(this.body.x + this.body.width / 2, this.body.y + this.body.height + 10);

            // These are the original positions, at rotation 0.
            this.centerBodyOnXY(this.collider_front.body, this.body.x + this.body.halfWidth, this.body.y + this.collider_radius);
            this.centerBodyOnBody(this.collider_center.body, this.body);
            this.centerBodyOnXY(this.collider_back.body, this.body.x + this.body.halfWidth, this.body.y + this.body.height - this.collider_radius);

            // Rotations need to be calculated center to center.
            this.body.updateCenter();
            this.collider_front.body.updateCenter();
            this.collider_back.body.updateCenter();

            Phaser.Math.RotateAround(this.collider_front.body.center, this.body.center.x, this.body.center.y, this.rotation);
            Phaser.Math.RotateAround(this.collider_back.body.center, this.body.center.x, this.body.center.y, this.rotation);

            // Then reposition.
            this.centerBodyOnPoint(this.collider_front.body, this.collider_front.body.center);
            this.centerBodyOnPoint(this.collider_back.body, this.collider_back.body.center);

            // For proper collisions.
            this.collider_front.body.velocity.copy(this.body.velocity);
            this.collider_center.body.velocity.copy(this.body.velocity);
            this.collider_back.body.velocity.copy(this.body.velocity);
        }
    }

    destroy() {
        this.text.destroy();
        super.destroy();
    }

    centerBodyOnBody(a, b) {
        a.position.set(
            b.x + b.halfWidth - a.halfWidth,
            b.y + b.halfHeight - a.halfHeight
        );
    }

    centerBodyOnXY(a, x, y) {
        a.position.set(
            x - a.halfWidth,
            y - a.halfHeight
        );
    }

    centerBodyOnPoint(a, p) {
        this.centerBodyOnXY(a, p.x, p.y);
    }
}