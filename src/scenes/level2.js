var level2Scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function SceneLevel2 (){
            Phaser.Scene.call(this, { key: 'level2' });
        },
    preload:
        function preload(){
            // default settings
            resetSettings(this);

            // get map
            this.load.tilemapTiledJSON('level2', 'assets/scenes/level2.json');           
        },
    create:
        function create(){
            //WORLD
                //load map
                map = this.make.tilemap({key: 'level2'});
                // MAP LAYER    
                var groundTiles = map.addTilesetImage('tiles2');
                groundLayer = map.createDynamicLayer('Ground', groundTiles, 0, 0);
                groundLayer.setDepth(currentDepth);
                currentDepth++;

                // PLAYER SPELL
                spell = this.physics.add.image(650, 350, 'spell');
                spell.setAlpha(.2, .2, .2, .2);
                spell.setDepth(currentDepth);
                currentDepth++;

                // WALL LAYER
                var scifi = map.addTilesetImage('scifi');
                wallLayer = map.createDynamicLayer('Wall', scifi, 0, 0);
                wallLayer.setCollisionByExclusion([-1]);   
                wallLayer.setDepth(currentDepth);
                currentDepth++;
                
                // OBSTACLE LAYER
                obstacleLayer = map.createDynamicLayer('Obstacles', scifi, 0, 0);
                obstacleLayer.setCollisionByExclusion([-1]);    
                obstacleLayer.setDepth(currentDepth);
                currentDepth++;

                // NPC DEPTH
                spawnLayer = currentDepth;
                currentDepth++;

                //PLAYER
                playerDepth = currentDepth;
                initializePlayer(character, 480, 2400, this);
                player.setDepth(currentDepth);
                currentDepth++;

                // PASSABLE LAYER
                passableLayer = map.createDynamicLayer('Passable', scifi, 0, 0); 
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
                initializeEnemy(new mercenary(), 380, 1980, this);
                initializeEnemy(new mercenary(), 480, 1980, this);
                initializeEnemy(new mercenary(), 580, 1980, this);
                initializeEnemy(new mercenary(), 480, 1800, this);
                initializeEnemy(new mercenary(), 480, 1610, this);
                initializeEnemy(new mercenary(), 620, 1470, this);
                initializeEnemy(new mercenary(), 480, 1260, this);
                initializeEnemy(new mercenary(), 410, 1130, this);
                initializeEnemy(new mercenary(), 550, 1130, this);

                // boss room
                initializeEnemy(new mercenary(), 280, 700, this);
                initializeEnemy(new mercenary(), 680, 700, this);
                initializeEnemy(new mercenary(), 850, 700, this);
                initializeEnemy(new mercenary(), 110, 700, this);
                initializeEnemy(new mercenary(), 280, 560, this);
                initializeEnemy(new terminator(), 480, 560, this); 
                initializeEnemy(new mercenary(), 680, 560, this);
                initializeEnemy(new mercenary(), 280, 420, this);
                initializeEnemy(new mercenary(), 480, 420, this);
                initializeEnemy(new mercenary(), 680, 420, this);
                initializeEnemy(new mercenary(), 850, 420, this);
                initializeEnemy(new mercenary(), 110, 420, this);
                initializeEnemy(new mercenary(), 610, 280, this);
                initializeEnemy(new mercenary(), 350, 280, this);

            // CONTROLS
                //Add Keyboard Events
                initializeControls(this);

            //CAMERA
                initializeCamera(this);

            //OBJECT COLLISIONS
                initializeCollisions(this);
                // door overlap
                doorLayer.setTileIndexCallback(1, function(){
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
