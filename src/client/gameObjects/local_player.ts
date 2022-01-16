import * as Phaser from 'phaser';

import { shape } from '../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    public health: number = 0;
    
    private username_text: Phaser.GameObjects.Text;
    private health_text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, { label: 'player', isSensor: false, vertices: shape });

        this.id = playerInfo.id;
        this.health = playerInfo.health;
        
        scene.add.existing(this);

        this.username_text = scene.add.text(
            playerInfo.position.x,
            playerInfo.position.y + 70,
            playerInfo.username,
            {
                font: '24px Calibri'
            }
        ).setOrigin(0.5, 0.5);

        this.username_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        this.health_text = scene.add.text(
            playerInfo.position.x,
            playerInfo.position.y + 90,
            playerInfo.health + "%",
            {
                font: '24px Calibri'
            }
        ).setOrigin(0.5, 0.5);

        this.health_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        this.setTint(playerInfo.color);
        this.username_text.setTint(playerInfo.color);
        this.health_text.setTint(playerInfo.color);
    }

    create() {

    }

    update(time, delta): void {
        this.username_text.setPosition(this.x, this.y + 70);
        this.health_text.setPosition(this.x, this.y + 90);
        this.health_text.text = Math.round(this.health) + "%";
    }

    destroy() {
        this.username_text.destroy();
        this.health_text.destroy();
        super.destroy();
    }
}