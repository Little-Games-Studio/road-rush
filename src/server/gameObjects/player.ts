import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {

    public id: integer;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene, playerInfo.position.x, playerInfo.position.y, 'race_car');

        this.id = playerInfo.id;

        scene.add.existing(this);
    }

    create() {

    }

    update(time, delta): void {

    }

    destroy() {

    }

 
}