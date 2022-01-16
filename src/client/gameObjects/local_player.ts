import * as Phaser from 'phaser';

import { shape } from '../../utils/player_utils';

export class Player extends Phaser.Physics.Matter.Sprite {

    public id: integer;
    
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, playerInfo: any) {

        super(scene.matter.world, playerInfo.position.x, playerInfo.position.y, 'race_car', 0, { label: 'player', isSensor: false, vertices: shape });

        this.id = playerInfo.id;
        
        scene.add.existing(this);

        this.text = scene.add.text(playerInfo.position.x, playerInfo.position.y, playerInfo.username, {
            font: '24px Calibri'
        }).setOrigin(0.5, 0.5);

        this.text.setShadow(1, 1, 'rgba(0,0,0,1)', 3);

        this.setTint(playerInfo.color);
        this.text.setTint(playerInfo.color);
    }

    create() {

    }

    update(time, delta): void {

        this.text.setPosition(this.x + this.width / 2, this.y + this.height + 10);
    }

    destroy() {
        this.text.destroy();
        super.destroy();
    }
}