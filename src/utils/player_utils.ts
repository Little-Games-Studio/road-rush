export function centerBodyOnBody(a: (Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) & Phaser.Physics.Arcade.Body, b: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) {
    a.position.set(
        b.x + b.halfWidth - a.halfWidth,
        b.y + b.halfHeight - a.halfHeight
    );
}

export function centerBodyOnXY(a: (Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) & Phaser.Physics.Arcade.Body, x: number, y: number) {
    a.position.set(
        x - a.halfWidth,
        y - a.halfHeight
    );
}

export function centerBodyOnPoint(a: (Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) & Phaser.Physics.Arcade.Body, p: Phaser.Math.Vector2) {
    centerBodyOnXY(a, p.x, p.y);
}