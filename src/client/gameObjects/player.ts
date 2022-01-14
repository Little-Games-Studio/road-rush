import * as Phaser from 'phaser';

import { centerBodyOnBody, centerBodyOnXY, centerBodyOnPoint } from './../../utils/player_utils';

export class Player extends Phaser.Physics.Arcade.Sprite {

    public id: integer;
    public player_type: string;
    public speed: integer = 500;
    
    private text: Phaser.GameObjects.Text;

    private collider_radius: integer;
    private collider_front: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    private collider_center: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    private collider_back: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

    constructor(scene: Phaser.Scene, playerInfo: any, player_type: any) {

        super(scene, playerInfo.position.x, playerInfo.position.y, 'race_car');

        this.id = playerInfo.id;
        this.player_type = player_type;
        this.collider_radius = playerInfo.collider_radius;
        
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

        this.text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        this.setTint(playerInfo.color);
        this.text.setTint(playerInfo.color);
    }

    create() {
        centerBodyOnXY(this.collider_front.body, this.body.x + this.body.halfWidth, this.body.y + this.collider_radius);
        centerBodyOnBody(this.collider_center.body, this.body);
        centerBodyOnXY(this.collider_back.body, this.body.x + this.body.halfWidth, this.body.y + this.body.height - this.collider_radius);
    }

    update(time, delta): void {

        this.text.setPosition(this.body.x + this.body.width / 2, this.body.y + this.body.height + 10);

        // These are the original positions, at rotation 0.
        centerBodyOnXY(this.collider_front.body, this.body.x + this.body.halfWidth, this.body.y + this.collider_radius);
        centerBodyOnBody(this.collider_center.body, this.body);
        centerBodyOnXY(this.collider_back.body, this.body.x + this.body.halfWidth, this.body.y + this.body.height - this.collider_radius);

        // Rotations need to be calculated center to center.
        this.body.updateCenter();
        this.collider_front.body.updateCenter();
        this.collider_back.body.updateCenter();

        Phaser.Math.RotateAround(this.collider_front.body.center, this.body.center.x, this.body.center.y, this.rotation);
        Phaser.Math.RotateAround(this.collider_back.body.center, this.body.center.x, this.body.center.y, this.rotation);

        // Then reposition.
        centerBodyOnPoint(this.collider_front.body, this.collider_front.body.center);
        centerBodyOnPoint(this.collider_back.body, this.collider_back.body.center);

        // For proper collisions.
        this.collider_front.body.velocity.copy(this.body.velocity);
        this.collider_center.body.velocity.copy(this.body.velocity);
        this.collider_back.body.velocity.copy(this.body.velocity);
    }

    destroy() {
        this.text.destroy();
        this.collider_front.destroy();
        this.collider_center.destroy();
        this.collider_back.destroy();
        super.destroy();
    }
}