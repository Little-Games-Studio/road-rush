import * as Phaser from 'phaser';

import { shape } from './../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    public health: number = 100;
    public speed: number = 0;
    public is_colliding: boolean = false;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: false,
            vertices: shape
        });

        this.id = playerInfo.id;
        this.health = 100;
        this.speed = 0;

        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            this.speed = -this.speed / 4;

            var bodyA = data.bodyA as MatterJS.BodyType;
            var bodyB = data.bodyB as MatterJS.BodyType;
            
            if (bodyA.label === 'Rectangle Body') { // if player hits the walls

                this.health -= bodyB.speed
            }
            else if (bodyB.label === 'Rectangle Body') { // if player hits the walls

                this.health -= bodyA.speed
            }
            else if (bodyA.label === 'player' && bodyB.label === 'player') { // if player hits other player
               /*  console.log(this.body, bodyA.parent.id, bodyB.parent.id) */
                if (this.body == bodyA) {
                    this.health -= bodyB.speed;
                    this.health -= bodyA.speed / 4;
                }
                else if (this.body == bodyB) {
                    this.health -= bodyA.speed
                    this.health -= bodyB.speed / 4;
                }
            }
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