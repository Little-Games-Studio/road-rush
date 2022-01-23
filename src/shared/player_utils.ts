const left = 0;

export const shape: Phaser.Types.Math.Vector2Like[] = [
    { x: 5, y: 10 },
    { x: 6, y: 5 },
    { x: 8, y: 0 },
    { x: 50, y: 0 },
    { x: 52, y: 5 },
    { x: 52, y: 92 },
    { x: 50, y: 94 },
    { x: 48, y: 96 },
    { x: 8, y: 96 },
    { x: 6, y: 94 },
    { x: 5, y: 92 },
];

export interface PlayerInfo {
    id: string,
    session: string,
    username: string,
    health: number,
    color: number,
    position: {
        x: number,
        y: number
    },
    hud_text_y_position: number
}