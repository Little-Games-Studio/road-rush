import * as Phaser from 'phaser';

import { centerBodyOnBody, centerBodyOnXY, centerBodyOnPoint } from './../../utils/player_utils';

export class Player extends Phaser.Physics.Arcade.Sprite {

    public id: integer;

    private collider_radius: integer;
    public collider_front: any;
    public collider_center: any;
    public collider_back: any;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene, playerInfo.position.x, playerInfo.position.y, 'race_car');

        this.id = playerInfo.id;
        this.collider_radius = playerInfo.collider_radius;

        scene.add.existing(this);

        this.collider_front = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y - 25, '');
        this.collider_front.body.setCircle(this.collider_radius, -8, -8);
        this.collider_front.player = this;
        this.collider_front.type = 'front';

        this.collider_center = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y, '');
        this.collider_center.body.setCircle(this.collider_radius, -8, -8);
        this.collider_center.player = this;
        this.collider_center.type = 'center';

        this.collider_back = this.scene.physics.add.image(playerInfo.position.x, playerInfo.position.y + 25, '');
        this.collider_back.body.setCircle(this.collider_radius, -8, -8);
        this.collider_back.player = this;
        this.collider_back.type = 'back';
    }

    create() {
        centerBodyOnXY(this.collider_front.body, this.body.x + this.body.halfWidth, this.body.y + this.collider_radius);
        centerBodyOnBody(this.collider_center.body, this.body);
        centerBodyOnXY(this.collider_back.body, this.body.x + this.body.halfWidth, this.body.y + this.body.height - this.collider_radius);
    }

    update(time, delta): void {
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
        this.collider_front.destroy();
        this.collider_center.destroy();
        this.collider_back.destroy();
        super.destroy();
    }
}