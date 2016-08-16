/// <reference path='../phaser/typescript/phaser.d.ts'/>


class Game1 {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    game: Phaser.Game;
    player: Phaser.Sprite;

    preload() {
        this.game.load.image('player', 'assets/Player.png');
        this.game.load.image('wall', 'assets/Wall.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = this.game.add.sprite(0, 0, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.rotation = 90;

        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.allowRotation = true;

        this.game.add.sprite(0, 100, 'wall');
    }

    update() {
        this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 60, this.game.input.activePointer, 500);
    }
}

window.onload = () => {
    var game = new Game1();
}
