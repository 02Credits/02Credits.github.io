var Game1 = (function () {
    function Game1() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    Game1.prototype.preload = function () {
        this.game.load.image('player', 'assets/Player.png');
    };
    Game1.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, 'player');
    };
    Game1.prototype.update = function () {
    };
    return Game1;
}());
