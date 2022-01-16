import { throws } from 'assert';
import * as Phaser from 'phaser';

import { shape } from '../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    public session: string;
    public health: number = 100;
    public speed: number = 0;
    public is_colliding: boolean = false;

    constructor(scene: Phaser.Scene, playerInfo: any, collision_group: number) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: true,
            vertices: shape
        });

        this.id = playerInfo.id;
        this.session = playerInfo.session;
        this.health = 100;
        this.speed = 0;

        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {

            var bodyA = data.bodyA as MatterJS.BodyType;
            var bodyB = data.bodyB as MatterJS.BodyType;

            var health_to_substract = 0;
            var collided = false;
            
            if (bodyA.label === 'Rectangle Body') { // if player hits the walls

                health_to_substract = bodyB.speed;
                collided = true;
            }
            else if (bodyB.label === 'Rectangle Body') { // if player hits the walls

                health_to_substract = bodyA.speed
                collided = true;
            }
            else if (bodyA.label === 'player' && bodyB.label === 'player') { // if player hits other player
          
                if (this.body == bodyA) {
                    var bodyB_parent = bodyB.gameObject as Player;
                    var bodyB_session = bodyB_parent.session;

                    if (playerInfo.session == bodyB_session) {
                        collided = true;
                        health_to_substract = bodyB.speed + bodyA.speed / 4;
                    }
                    
                }
                else if (this.body == bodyB) {
                    var bodyA_parent = bodyA.gameObject as Player;
                    var bodyA_session = bodyA_parent.session;

                    if (playerInfo.session == bodyA_session) {
                        collided = true;
                        health_to_substract = bodyA.speed + bodyB.speed / 4;
                    }
                }
            }

            if (collided) {
                if (this.health - health_to_substract > 0)
                    this.health = this.health - health_to_substract;
                else
                    this.health = 0;

                this.speed = -this.speed / 4;
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