import * as Phaser from 'phaser';

import { shape } from '../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    public health: number = 0;
    public username = "";
    
    private hud_text: Phaser.GameObjects.Text;
    /* private username_text: Phaser.GameObjects.Text;
    private health_text: Phaser.GameObjects.Text; */

    constructor(scene: Phaser.Scene, playerInfo: any) {
        
        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, {
            label: 'player',
            isSensor: true,
            vertices: shape
        });

        this.id = playerInfo.id;
        this.username = playerInfo.username;
        this.health = playerInfo.health;
        
        scene.add.existing(this);

        this.hud_text = scene.add.text(30, playerInfo.hud_text_y_position, playerInfo.username + " - " + playerInfo.health + "%", { font: '28px Calibri' });
        this.hud_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        /* this.username_text = scene.add.text(
            playerInfo.position.x,
            playerInfo.position.y + 70,
            playerInfo.username,
            {
                font: '24px Calibri'
            }
        ).setOrigin(0.5, 0.5);

        this.username_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3); */

        /* this.health_text = scene.add.text(
            playerInfo.position.x,
            playerInfo.position.y + 90,
            playerInfo.health + "%",
            {
                font: '24px Calibri'
            }
        ).setOrigin(0.5, 0.5);

        this.health_text.setShadow(1, 1, 'rgba(0,0,0,1)', 3); */

        this.setTint(0xffffff, 0xffffff, playerInfo.color, playerInfo.color);
        this.hud_text.setTint(0xffffff, 0xffffff, playerInfo.color, playerInfo.color);
        /* this.username_text.setTint(playerInfo.color);
        this.health_text.setTint(playerInfo.color); */
    }

    create() {

    }

    update(time, delta): void {
        this.hud_text.text = this.username + " - " + Math.round(this.health) + "%";
        /* this.username_text.setPosition(this.x, this.y + 70);
        this.health_text.setPosition(this.x, this.y + 90);
        this.health_text.text = Math.round(this.health) + "%"; */
    }

    destroy() {
        this.hud_text.destroy();
        /* this.username_text.destroy();
        this.health_text.destroy(); */
        super.destroy();
    }
}