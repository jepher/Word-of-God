 // MENU
        var menuScene = new Phaser.Class({
            Extends: Phaser.Scene,
            initialize:
                function SceneMainMenu ()
                {
                    Phaser.Scene.call(this, { key: 'menu' });
                },
            
            preload: 
                function (){ // LOAD ALL GAME ASSETS
                    // MENU
                    this.load.image('background', 'assets/images/menu/cross.jpg');
                    this.load.image('title', 'assets/images/menu/title.png');
                    this.load.image('controlsTitle', 'assets/images/menu/controlsTitle.png');
                    this.load.image('controls', 'assets/images/menu/controls.png');         
                    this.load.image('mechanicsTitle', 'assets/images/menu/mechanicsTitle.png');
                    this.load.image('mechanics', 'assets/images/menu/mechanics.png');  
                    this.load.image('alliesTitle', 'assets/images/menu/alliesTitle.png');
                    this.load.image('allies', 'assets/images/menu/allies.png');       
                    this.load.image('overlay', 'assets/images/menu/overlay.png');      
                    this.load.image('startButtonNormal', 'assets/images/menu/startNormal.png');
                    this.load.image('startButtonClicked', 'assets/images/menu/startClicked.png');
                    this.load.image('helpButtonNormal', 'assets/images/menu/helpNormal.png');
                    this.load.image('helpButtonClicked', 'assets/images/menu/helpClicked.png');
                    this.load.image('homeButtonNormal', 'assets/images/menu/homeNormal.png');
                    this.load.image('homeButtonClicked', 'assets/images/menu/homeClicked.png');
                    this.load.image('nextButtonNormal', 'assets/images/menu/nextNormal.png');
                    this.load.image('nextButtonClicked', 'assets/images/menu/nextClicked.png');
                    this.load.image('backButtonNormal', 'assets/images/menu/backNormal.png');
                    this.load.image('backButtonClicked', 'assets/images/menu/backClicked.png');
                    this.load.image('gameOver', 'assets/images/menu/gameOver.png');
                    this.load.image('win', 'assets/images/menu/youWin.png');

                    // GAME ASSETS
                        // TILESETS
                            this.load.spritesheet('tiles','assets/tilesets/tiles.png', {frameWidth: 32, frameHeight: 32});
                            this.load.spritesheet('tiles2','assets/tilesets/tiles2.png', {frameWidth: 32, frameHeight: 32});
                            this.load.spritesheet('obstacles', 'assets/tilesets/objectTilesheet.png', {frameWidth: 32, frameHeight: 32});
                            this.load.spritesheet('scifi', 'assets/tilesets/scifi.png', {frameWidth: 32, frameHeight: 32});
                            this.load.spritesheet('doors', 'assets/tilesets/doors.png', {frameWidth: 32, frameHeight: 32});
                            this.load.spritesheet('hell', 'assets/tilesets/hell.png', {frameWidth: 32, frameHeight: 32});

                        // SPRITESHEETS
                            this.load.spritesheet('religious', 'assets/sprites/holySprites.png', { frameWidth: 32, frameHeight: 32 });
                            this.load.spritesheet('thugs', 'assets/sprites/thugSprites.png', { frameWidth: 32, frameHeight: 32 });
                            this.load.spritesheet('bosses', 'assets/sprites/bossSprites.png', { frameWidth: 32, frameHeight: 32 });
                            this.load.spritesheet('demons', 'assets/sprites/demonSprites.png', { frameWidth: 32, frameHeight: 32 });
                            this.load.spritesheet('satan', 'assets/sprites/satan.png', { frameWidth: 96, frameHeight: 48 });

                        // IMAGES
                            this.load.image('bullet', 'assets/images/projectiles/bullet.png');
                            this.load.image('shotgun', 'assets/images/projectiles/shotgun.png');
                            this.load.image('missile', 'assets/images/projectiles/missile.png');
                            this.load.image('demonStar', 'assets/images/projectiles/demonStar.png');
                            this.load.image('ghostBlast', 'assets/images/projectiles/ghostBlast.png');
                            this.load.image('satanBlast', 'assets/images/projectiles/satanBlast.png');
                            this.load.image('satanBomb', 'assets/images/projectiles/satanBomb.png');
                            this.load.image('satanLaser', 'assets/images/projectiles/satanLaser.png');
                            this.load.image('reaperStar', 'assets/images/projectiles/reaperStar.png');
                            this.load.image('lichHeal', 'assets/images/projectiles/lichHeal.png');
                            this.load.image('divineLight', 'assets/images/projectiles/divineLight.png');
                            this.load.image('spell', 'assets/images/spell.png');
                            this.load.image('star', 'assets/images/star.png');
                            this.load.image('blood', 'assets/images/blood.png');

                        // AUDIO
                            this.load.audio('bulletFX', 'assets/audio/gunshot.mp3');
                },
            create: 
                function (){
                    // background
                    this.add.image(480, 350, 'background');

                    // title
                    this.add.image(480, 210, 'title');

                    // Start Button
                    var btnStart = this.add.sprite(480, 390, 'startButtonNormal').setInteractive();
                    btnStart.on('pointerover', function (event) { 
                        //btnStart.setTexture('imgButtonStartHover');
                    });
                    btnStart.on('pointerout', function (event) { 
                        btnStart.setTexture('startButtonNormal');
                    });
                    btnStart.on('pointerdown', function(event){
                        btnStart.setTexture('startButtonClicked');
                    }); 
                    btnStart.on('pointerup', function(event){
                        this.scene.start('level1');
                        currentScene = 2;
                    }, this); // start game

                    // help button
                    var btnHelp = this.add.sprite(480, 470, 'helpButtonNormal').setInteractive();
                    btnHelp.on('pointerout', function (event) { 
                        btnHelp.setTexture('helpButtonNormal');
                    });
                    btnHelp.on('pointerdown', function(event){
                        btnHelp.setTexture('helpButtonClicked');
                    }); 
                    btnHelp.on('pointerup', function(event){
                        this.scene.start('help');
                        currentScene = 1;
                    }, this);
                },
            update: function(){}
        });