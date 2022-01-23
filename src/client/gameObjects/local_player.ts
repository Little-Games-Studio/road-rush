import * as Phaser from 'phaser';

import { shape, PlayerInfo } from '../../shared/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: string;
    public health: number = 0;
    public username = "";
    
    private hud_text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, playerInfo: PlayerInfo) {
        
        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: true,
            vertices: shape
        });

        this.setOrigin(this.centerOfMass.x + 0.02, this.centerOfMass.y - 0.02)

        this.id = playerInfo.id;
        this.username = playerInfo.username;
        this.health = playerInfo.health;
        
        scene.add.existing(this);

        this.hud_text = scene.add.text(30, playerInfo.hud_text_y_position, playerInfo.username + " - " + playerInfo.health + "%", { font: '28px Calibri' });
        this.hud_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        this.setTint(0xffffff, 0xffffff, playerInfo.color, playerInfo.color);
        this.hud_text.setTint(0xffffff, 0xffffff, playerInfo.color, playerInfo.color);
    }

    create() {

    }

    update(time, delta): void {
        this.hud_text.text = this.username + " - " + Math.round(this.health) + "%";
    }

    destroy() {
        this.hud_text.destroy();
        super.destroy();
    }
}