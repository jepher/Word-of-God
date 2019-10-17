var hellScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function SceneHell (){
            Phaser.Scene.call(this, { key: 'hell' });
        },
    preload:
        function preload(){
            // default settings
            resetSettings(this);

            // get map
            this.load.tilemapTiledJSON('hell', 'assets/scenes/hell.json');           
        },
    create:
        function create(){
            //WORLD
                //load map
                map = this.make.tilemap({key: 'hell'});
                // LAVA LAYER
                var hellTiles = map.addTilesetImage('hell');
                lavaLayer = map.createDynamicLayer('Lava', hellTiles, 0, 0);
                lavaLayer.setCollisionByExclusion([-1]);
                lavaLayer.setDepth(currentDepth);
                currentDepth++;

                // MAP LAYER    
                groundLayer = map.createDynamicLayer('Ground', hellTiles, 0, 0);
                groundLayer.setDepth(currentDepth);
                currentDepth++;

                // PLAYER SPELL
                spell = this.physics.add.image(650, 350, 'spell');
                spell.setAlpha(.2, .2, .2, .2);
                spell.setDepth(currentDepth);
                currentDepth++;

                // WALL LAYER
                wallLayer = map.createDynamicLayer('Wall', hellTiles, 0, 0);
                wallLayer.setCollisionByExclusion([-1]);  
                wallLayer.setDepth(currentDepth);
                currentDepth++; 
                
                // OBSTACLE LAYER
                obstacleLayer = map.createDynamicLayer('Obstacles', hellTiles, 0, 0);
                obstacleLayer.setCollisionByExclusion([-1]);    
                obstacleLayer.setDepth(currentDepth);
                currentDepth++;

                // NPC DEPTH
                spawnLayer = currentDepth;
                currentDepth++;

                //PLAYER
                playerDepth = currentDepth;
                initializePlayer(character, 480, 3790, this);
                player.setDepth(currentDepth);
                currentDepth++;
                player.type.maxMana = 100;
                player.maxMana = 100;
                player.mana = 100;

                // PASSABLE LAYER
                passableLayer = map.createDynamicLayer('Passable', hellTiles, 0, 0); 
                passableLayer.setDepth(currentDepth);
                currentDepth++;

                // DOOR LAYER
                var doorTiles = map.addTilesetImage('doors');
                doorLayer = map.createDynamicLayer('Door', doorTiles, 0, 0);
                doorLayer.setVisible(false);
                doorLayer.setCollisionByExclusion([-1]);
                doorLayer.setDepth(currentDepth);
                currentDepth++;

            // NPCS
                spawnAllies(this);
                initializeAlly(new apostle(), player.x, player.y, this);
                initializeAlly(new apostle(), player.x, player.y, this);

                initializeEnemy(new demon(this), 480, 3210, this);
                initializeEnemy(new ghost(), 210, 3320, this);
                initializeEnemy(new ghost(), 750, 3320, this);
                initializeEnemy(new ghost(), 300, 3210, this);
                initializeEnemy(new ghost(), 660, 3210, this);
                initializeEnemy(new ghost(), 210, 3080, this);
                initializeEnemy(new ghost(), 750, 3080, this);

                initializeEnemy(new demon(this), 480, 2500, this);
                initializeEnemy(new ghost(), 210, 2610, this);
                initializeEnemy(new ghost(), 750, 2610, this);
                initializeEnemy(new ghost(), 300, 2500, this);
                initializeEnemy(new ghost(), 660, 2500, this);
                initializeEnemy(new ghost(), 210, 2370, this);
                initializeEnemy(new ghost(), 750, 2370, this);

                initializeEnemy(new demon(this), 480, 1800, this);
                initializeEnemy(new ghost(), 210, 1910, this);
                initializeEnemy(new ghost(), 750, 1910, this);
                initializeEnemy(new ghost(), 300, 1800, this);
                initializeEnemy(new ghost(), 660, 1800, this);
                initializeEnemy(new ghost(), 210, 1570, this);
                initializeEnemy(new ghost(), 750, 1570, this);

                initializeEnemy(new satan(this), 480, 650, this);
                initializeEnemy(new reaper(this), 190, 990, this);
                initializeEnemy(new reaper(this), 770, 990, this);
                initializeEnemy(new reaper(this), 150, 260, this);
                initializeEnemy(new reaper(this), 810, 260, this);


            // CONTROLS
                //Add Keyboard Events
                initializeControls(this);

            //CAMERA
                initializeCamera(this);

            //OBJECT COLLISIONS
                initializeCollisions(this);
                this.physics.add.collider(lavaLayer, player);
                // door overlap
                doorLayer.setTileIndexCallback(1, function(){
                    if(!changingMap){
                        changingMap = true;    
                        setGameOver(this);
                        gameStatus.setTexture('win');
                    }
                }, this);
                this.physics.add.overlap(doorLayer, player);
            
            // UI
                initializeUI(this);

            // AUDIO
                initializeAudio(this);
        },
    update: function(){
        update(this)
    }
});
