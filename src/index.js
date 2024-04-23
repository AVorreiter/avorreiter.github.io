import Phaser from 'phaser';
import Hintergrund from './assets/hintergrund.png';
import Benzin from './assets/benzin.png';
import Lacke from './assets/lacke.png';
import Auto from './assets/auto.png';
import Curb from './assets/curb.png';
import Gold from './assets/gold.png';
document.title = "F1 Game";



class MyGame extends Phaser.Scene {
    constructor() {
        super()
        this.lackenCount = 0
        this.curbsCount = 0
    }


    preload() {
        //load images
        this.load.image('bg', Hintergrund)
        this.load.image('benzin', Benzin)
        this.load.image('lacke', Lacke)
        this.load.image('auto', Auto)
        this.load.image('curb', Curb)
        this.load.image('gold', Gold)

    }

    create() {

        this.bg1 = this.add.image(0, 0, 'bg').setOrigin(0,0)
        console.log(this.bg1.x)
        console.log(this.bg1.width)
        this.bg2 = this.add.image(this.bg1.width, 0, 'bg').setOrigin(0,0)
        console.log(this.bg2.x)


        this.backgroundSpeed = 4.8;

        const playerStartX = 130
        const playerStartY = this.cameras.main.centerY

        this.player = this.physics.add.sprite(playerStartX, playerStartY, 'auto').setScale(0.25)
        this.player.setBounce(0)
        this.player.setCollideWorldBounds(true)



        this.benzine = this.physics.add.group()
        this.lacken = this.physics.add.group()
        this.curbs = this.physics.add.group()
        this.golds = this.physics.add.group()



        const scoreText = this.add.text(this.cameras.main.centerX, 15, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        }).setOrigin(0.5, 0)

        let score = 0

        const createBenzin = () => {
            const x = 1500
            const y = Phaser.Math.FloatBetween(200, 700)


            let benzin = this.benzine.create(x, y, 'benzin').setScale(0.05).refreshBody().setMaxVelocity(0, 0).setGravity(0, 0)


            this.tweens.add({
                targets: benzin,
                x: -100,
                duration: 5500,
                ease: 'Linear',
                onComplete: () => benzin.destroy()
            });
        }

        this.createBenzinLoop = this.time.addEvent({
            delay: Phaser.Math.FloatBetween(2500, 5000),
            callback: createBenzin,
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(this.player, this.benzine, collect, null, this)

        const createGold = () => {
            const x = 1500
            const y = Phaser.Math.FloatBetween(200, 700)


            let gold = this.golds.create(x, y, 'gold').setScale(0.03).refreshBody().setMaxVelocity(0, 0).setGravity(0, 0)


            this.tweens.add({
                targets: gold,
                x: -100,
                duration: 5500,
                ease: 'Linear',
                onComplete: () => gold.destroy()
            });
        }

        this.createGoldLoop = this.time.addEvent({
            delay: Phaser.Math.FloatBetween(2500, 5000),
            callback: createGold,
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(this.player, this.golds, collect, null, this)

        const createLacke = () => {
            const x = 1500
            const y = Phaser.Math.Between(200, 700)

            let lacke = this.lacken.create(x, y, 'lacke').setScale(0.045).refreshBody().setMaxVelocity(0, 0).setGravity(0, 0)


            this.tweens.add({
                targets: lacke,
                x: -100,
                duration: 5500,
                ease: 'Linear',
                onComplete: () => lacke.destroy()
            });

            this.time.addEvent({
                delay: 30000,
                callback: () => lacke.destroy()
            })
        }

        this.createLackeLoop = this.time.addEvent({
                delay: Phaser.Math.FloatBetween(2500, 4000),
            callback: createLacke,
            callbackScope: this,
            loop: true
        })

        function collect(player, item) {
            item.disableBody(true, true);
            if (item.texture.key === 'benzin') {
                score += 1;
            } else if (item.texture.key === 'gold') {
                score += 5;
            }
            scoreText.setText('score: ' + score);
        }


        const lackeTouched = (player, lacke) => {
            if (!lacke.touched) {
                lacke.touched = true
                this.lackenCount++
                console.log("Lacken Berührungen: ", this.lackenCount)

                if (this.lackenCount >= 5) {
                    console.log("Game Over Lacken!")
                    this.gameOver()
                }
            }

            if (!player.isTurning) {
                player.isTurning = true

                const rotateTween = this.tweens.add({
                    targets: player,
                    angle: player.angle + 360,
                    duration: 1000,
                    ease: 'Linear',
                    onComplete: () => {
                        player.isTurning = false
                    },
                    onUpdate: (tween, target) => {
                        updateHitbox(player)
                    }
                });

                rotateTween.on('complete', () => {
                    rotateTween.stop()
                });
            }
        };

        // gemeinsam mit ChatGPT ;-)
        function updateHitbox(player) {


            // Berechne die neue Hitbox basierend auf der aktuellen Rotation des Sprites
            var radians = Phaser.Math.DegToRad(player.angle);
            var width = Math.abs(player.width * Math.cos(radians)) + Math.abs(player.height * Math.sin(radians));
            var height = Math.abs(player.height * Math.cos(radians)) + Math.abs(player.width * Math.sin(radians));

            // Aktualisiere die Hitbox des Sprites
            player.body.setSize(width, height, true);
        }


        this.physics.add.collider(this.player, this.lacken, lackeTouched, null, this)


        const createCurb = () => {
            const x = 1500
            const y = Phaser.Math.Between(260, 640)

            let curb = this.curbs.create(x, y, 'curb').setScale(0.09).refreshBody().setMaxVelocity(0, 0).setGravity(0, 0)


            this.tweens.add({
                targets: curb,
                x: -100,
                duration: 5500,
                ease: 'Linear',
                onComplete: () => curb.destroy()
            });

            const curbW = curb.width
            const curbH = curb.height

            curb.setAngle(90)
            curb.body.setSize(curbH, curbW, true);


            this.time.addEvent({
                delay: 30000,
                callback: () => curb.destroy()
            })
        }

        this.createCurbLoop = this.time.addEvent({
            delay: Phaser.Math.FloatBetween(3000, 6000),
            callback: createCurb,
            callbackScope: this,
            loop: true
        })


        const curbTouched = (player, curb) => {
            if (!curb.touched) {
                curb.touched = true
                this.curbsCount++
                console.log("Curbs Berührungen: ", this.curbsCount)

                if (this.curbsCount >= 1) {
                    console.log("Game Over Curbs!")
                    this.gameOver();
                }
            }
        };

        this.physics.add.collider(this.player, this.curbs, curbTouched, null, this)
        this.physics.add.collider(this.player, this.lacken, curbTouched, null, this)


        // Pause button
        const pauseButton = this.add.text(this.cameras.main.width - 15, scoreText.y, 'Pause', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(1, 0).setInteractive()

        pauseButton.on('pointerdown', () => {
            if (this.game.isPaused) {
                this.game.resume()
            } else {
                this.game.pause()
            }
        });
    }
    resetGame() {
        // Zähler zurücksetzen
        this.lackenCount = 0;
        this.curbsCount = 0;

        // Szene neu starten
        this.scene.restart();
    }

    gameOver() {
        this.createLackeLoop.destroy()
        this.createBenzinLoop.destroy()
        this.createCurbLoop.destroy()
        this.createGoldLoop.destroy()

        // Spiel pausieren
        this.physics.pause()

        // Abdunkelung des Spielfelds
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7)
        overlay.setOrigin(0)

        // Game Over Text
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over', {
            font: '50px',
            fill: 'red'
        });
        gameOverText.setOrigin(0.5);

        // Restart Button
        const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Restart', {
            font: '30px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: {
                x: 20,
                y: 10
            }
        });
        restartButton.setOrigin(0.5)
        restartButton.setInteractive()
        restartButton.on('pointerdown', () => {
            this.resetGame(); // Spiel neu starten mit Zurücksetzen der Zähler
        });

    }
    update() {

        this.bg1.x -= this.backgroundSpeed
        this.bg2.x -= this.backgroundSpeed



        if (this.bg1.x + this.bg1.width < 0) {
            this.bg1.x = this.bg2.x + this.bg2.width
        }

        if (this.bg2.x + this.bg2.width < 0) {
            this.bg2.x = this.bg1.x + this.bg1.width
        }


        const cursors = this.input.keyboard.createCursorKeys()

        if (cursors.up.isDown && this.player.y > 210) {
            this.player.setVelocityY(-300)
            this.player.anims.play('up', true)
        } else if (cursors.down.isDown && this.player.y < 690) {
            this.player.setVelocityY(300)
            this.player.anims.play('down', true)
        } else {
            this.player.setVelocityY(0);

        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1500,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config)