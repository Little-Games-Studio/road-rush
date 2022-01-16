import * as Phaser from 'phaser';

import { shape } from './../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    public speed: number = 0;
    public is_colliding: boolean = false;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: false,
            vertices: shape
        });

        this.id = playerInfo.id;
        this.speed = 0;

        this.setOnCollide(() => {
            this.speed = -this.speed / 4
        });

        this.setOnCollideActive(() => {
            this.is_colliding = true;
        });

        this.setOnCollideEnd(() => {
            this.is_colliding = false;
        });

        scene.add.existing(this);
    }

    create() {

    }

    update(time, delta): void {

    }

    destroy() {
        super.destroy();
    }
}