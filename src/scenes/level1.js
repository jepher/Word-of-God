var level1Scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function SceneLevel1 (){
            Phaser.Scene.call(this, { key: 'level1' });
        },
    preload:
        function preload(){
            disciples = [];

            // default settings
            resetSettings(this);

            // get map
            this.load.tilemapTiledJSON('level1', 'assets/scenes/level1.json');           
        },
    create:
        function create(){
            //WORLD
                //load map
                map = this.make.tilemap({key: 'level1'});
                // MAP LAYER    
                var groundTiles = map.addTilesetImage('tiles');
                groundLayer = map.createDynamicLayer('Ground', groundTiles, 0, 0);
                groundLayer.setDepth(currentDepth);
                currentDepth++;

                // PLAYER SPELL
                spell = this.physics.add.image(650, 350, 'spell');
                spell.setAlpha(.2, .2, .2, .2);
                spell.setDepth(currentDepth);
                currentDepth++;

                // WALL LAYER
                var wallTiles = map.addTilesetImage('scifi');
                wallLayer = map.createDynamicLayer('Wall', wallTiles, 0, 0);
                wallLayer.setCollisionByExclusion([-1]);   
                wallLayer.setDepth(currentDepth);
                currentDepth++;
                
                // OBSTACLE LAYER
                var obstacleTiles = map.addTilesetImage('obstacles');
                obstacleLayer = map.createDynamicLayer('Obstacles', obstacleTiles, 0, 0);
                obstacleLayer.setCollisionByExclusion([-1]);    
                obstacleLayer.setDepth(currentDepth);
                currentDepth++;

                // NPC DEPTH
                spawnDepth = currentDepth;
                currentDepth++;

                //PLAYER
                playerDepth = currentDepth;
                initializePlayer(character, 480, 2350, this);
                player.setDepth(currentDepth);
                currentDepth++;

                // PASSABLE LAYER
                passableLayer = map.createDynamicLayer('Passable', obstacleTiles, 0, 0); 
                passableLayer.setDepth(currentDepth);
                currentDepth++;

                // TEMP DOOR LAYER
                var tempDoorLayer = map.createDynamicLayer('TempDoor', wallTiles, 0, 0);;

                // DOOR LAYER
                var doorTiles = map.addTilesetImage('doors');
                doorLayer = map.createDynamicLayer('Door', doorTiles, 0, 0);
                doorLayer.setDepth(currentDepth);
                currentDepth++;
                doorLayer.setVisible(false);
                doorLayer.setCollisionByExclusion([-1]);

            // NPCS
                initializeAlly(new apostle(), player.x, player.y, this);
                initializeAlly(new disciple(), player.x, player.y, this);
                initializeAlly(new disciple(), player.x, player.y, this);

                
                initializeEnemy(new thug(), 690, 2100, this);
                initializeEnemy(new thug(), 500, 1960, this);
                initializeEnemy(new thug(), 690, 1850, this);
                initializeEnemy(new thug(), 600, 1700, this);
                initializeEnemy(new thug(), 500, 1500, this);
                initializeEnemy(new thug(), 690, 1300, this);
                initializeEnemy(new thug(), 690, 1170, this);
                initializeEnemy(new thug(), 690, 1040, this);
                initializeEnemy(new thug(), 240, 700, this);
                initializeEnemy(new thug(), 480, 700, this);
                initializeEnemy(new thug(), 720, 700, this);
                initializeEnemy(new thug(), 240, 500, this);
                initializeEnemy(new thugLeader(), 480, 500, this);
                initializeEnemy(new thug(), 720, 500, this);
                initializeEnemy(new thug(), 240, 300, this);
                initializeEnemy(new thug(), 480, 300, this);
                initializeEnemy(new thug(), 720, 300, this);

            // CONTROLS
                //Add Keyboard Events
                initializeControls(this);

            //CAMERA
                initializeCamera(this);

            //OBJECT COLLISIONS
                initializeCollisions(this);
                // door overlap
                doorLayer.setTileIndexCallback(1601, function(){
                    if(!changingMap){
                        changingMap = true;    
                        nextLevel(this);
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
