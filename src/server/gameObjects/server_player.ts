import * as Phaser from 'phaser';

import { shape, PlayerInfo } from '../../shared/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: string;
    public session: string;
    public health: number = 100;
    public speed: number = 0;
    public rotation_speed = 0;
    public max_rotation_speed = 10;
    public is_colliding: boolean = false;

    constructor(scene: Phaser.Scene, playerInfo: PlayerInfo, collision_group: number) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: true,
            vertices: shape
        });

        this.setOrigin(this.centerOfMass.x + 0.02, this.centerOfMass.y - 0.02)

        this.id = playerInfo.id;
        this.session = playerInfo.session;
        
        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {

            var bodyA = data.bodyA as MatterJS.BodyType;
            var bodyB = data.bodyB as MatterJS.BodyType;

            var health_to_substract = 0;
            var collided = false;
            var collided_with_world_bounds = false;
            
            if (bodyA.label === 'Rectangle Body') { // if player hits the walls

                health_to_substract = bodyB.speed;
                collided = true;
                collided_with_world_bounds = true;
            }
            else if (bodyB.label === 'Rectangle Body') { // if player hits the walls

                health_to_substract = bodyA.speed
                collided = true;
                collided_with_world_bounds = true;
            }
            else if (bodyA.label === 'player' && bodyB.label === 'player') { // if player hits other player
                
                var myBody = null;
                var opponentsBody = null;

                if (this.body == bodyA) {
                    myBody = bodyA;
                    opponentsBody = bodyB;
                }
                else {
                    myBody = bodyB;
                    opponentsBody = bodyA;
                }

                var opponent = opponentsBody.gameObject as Player;
                var opponents_session = opponent.session;

                if (playerInfo.session == opponents_session) {
                    collided = true;
                    health_to_substract = opponentsBody.speed + myBody.speed / 4;

                    //opponent.setPosition(opponent.body.position.x - this.speed, opponent.body.position.y - this.speed)

                    if (this.speed > 0) {
                        this.speed = -1 * ((this.speed / 4) + 1);
                    }
                    else if (this.speed < 0) {
                        this.speed = -1 * ((this.speed / 4) - 1);
                    }
                }
            }

            if (collided) {

                if (this.health - health_to_substract > 0)
                    this.health = this.health - health_to_substract;
                else
                    this.health = 0;

                if (collided_with_world_bounds) {
                    if (this.speed > 0)
                        this.speed = -1 * ((this.speed / 4) + 1);
                    else if (this.speed < 0)
                        this.speed = -1 * ((this.speed / 4) - 1);
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