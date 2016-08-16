/// <reference path='../phaser/typescript/phaser.d.ts'/>


class Game1 {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('player', 'assets/Player.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, 'player');
    }

    update() {

    }
}
