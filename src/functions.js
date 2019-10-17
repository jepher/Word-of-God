function resetSettings(game){
    timerEvents = [];
    enemies = [];
    backup.forEach(function(element){
        disciples.push(element);
    });
    currentDepth = 0;
    paused = false;
    gameOver = false;
    changingMap = false;
    BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    SetToAngle = Phaser.Geom.Line.SetToAngle;
    velocityFromRotation = game.physics.velocityFromRotation;   
}

function initializeEnemy(type, x, y, game){
    var enemy = game.physics.add.sprite(x, y, type.key);
    enemy.setDepth(spawnDepth);
    if(type.key == 'satan'){
        initializeEnemy(new lich(enemy), enemy.x + 190, enemy.y - 130, game);
        initializeEnemy(new lich(enemy), enemy.x - 190, enemy.y - 130, game);
        initializeEnemy(new lich(enemy), enemy.x + 190, enemy.y + 130, game);
        initializeEnemy(new lich(enemy), enemy.x - 190, enemy.y + 130, game);
    }
    enemy.body.immovable = true;  
    initializeNPCAnimation(type.key, type.file, type.index, game);
    enemy.type = type;
    enemy.maxHealth = type.maxHealth;
    enemy.health = enemy.maxHealth;
    enemy.x = x;
    enemy.y = y;
    enemy.up = false;
    enemy.down = true;
    enemy.left = false;
    enemy.right = false;
    enemy.attacking = false;
    
    enemy.startTime = game.sys.game.loop.time;
    enemy.counting = false;
    enemy.direction = 0; // 0: left, 1: right, 2: up, 3: down
    enemy.update = function(){type.update(enemy, game)};

    // health
    enemy.graphics1 = game.add.graphics({fillStyle: { color: 0xb6bbc4 } });
    enemy.graphics1.setDepth(spawnDepth);    
    enemy.maxHealthBar = new Phaser.Geom.Rectangle();
    enemy.maxHealthBar.width = 80;
    enemy.maxHealthBar.height = 6;
    enemy.maxHealthBar.x = enemy.x - enemy.maxHealthBar.width / 2;
    enemy.maxHealthBar.y = enemy.y + 20;
    enemy.graphics1.fillRectShape(enemy.maxHealthBar);
    enemy.graphics2 = game.add.graphics({fillStyle: { color: 0xf94d4d } });
    enemy.graphics2.setDepth(spawnDepth);    
    enemy.healthBar = new Phaser.Geom.Rectangle();
    enemy.healthBar.width = enemy.maxHealthBar.width;
    enemy.healthBar.height = enemy.maxHealthBar.height;
    enemy.healthBar.x = enemy.maxHealthBar.x;
    enemy.healthBar.y = enemy.maxHealthBar.y;
    enemy.graphics2.fillRectShape(enemy.healthBar);

    // emitter
    starParticle = game.add.particles('star'); 
    enemy.emitter = starParticle.createEmitter({
        speed: 50,
        scale: {start: .1, end: 0},
    });
    enemy.emitter.startFollow(enemy);
    enemy.emitter.setVisible(false);

    // collision
    game.physics.add.collider(wallLayer, enemy);
    game.physics.add.collider(obstacleLayer, enemy);
    enemy.body.collideWorldBounds = true; 
    game.physics.add.overlap(enemy, spell, function(){
        if(spellActive && player.attackReady){
            enemy.emitter.setVisible(true);

            if(!enemy.type.invulnerable)
                enemy.health -= player.type.damage; // decrease health
            player.attackReady = false;
            timerEvents.push(game.time.addEvent({delay: 100, callback: function(){ 
                player.attackReady = true;
            }}));
            timerEvents.push(game.time.addEvent({delay: 300, callback: function(){ 
                enemy.emitter.setVisible(false);
            }}));
        }
    }, null, game);
    if(currentScene == scenes.length - 1){
        game.physics.add.collider(lavaLayer, enemy);
    }

    enemies.push(enemy);
}

function initializeAlly(type, x, y, game){
    var ally = game.physics.add.sprite(x, y, type.key);
    ally.setDepth(spawnDepth);
    ally.body.immovable = true;  
    ally.type = type;
    ally.maxHealth = type.maxHealth;
    ally.health = ally.maxHealth;
    ally.x = x;
    ally.y = y;
    ally.up = false;
    ally.down = true;
    ally.left = false;
    ally.right = false;
    ally.attacking = false;
    initializeNPCAnimation(type.key, type.file, type.index, game);
    ally.anims.play(ally.type.key + 'BackIdle', true);
    
    ally.velocity = new Phaser.Math.Vector2();
    ally.line = new Phaser.Geom.Line();
    ally.angle = BetweenPoints(ally, player);

    ally.startTime;
    ally.counting = false;
    ally.direction = 0; // 0: left, 1: right, 2: up, 3: down
    ally.update = function(){type.update(ally, game)};

    // health
    ally.graphics1 = game.add.graphics({fillStyle: { color: 0xb6bbc4 } });
    ally.graphics1.setDepth(spawnDepth);    
    ally.maxHealthBar = new Phaser.Geom.Rectangle();
    ally.maxHealthBar.width = 80;
    ally.maxHealthBar.height = 6;
    ally.maxHealthBar.x = ally.x - ally.maxHealthBar.width / 2;
    ally.maxHealthBar.y = ally.y + 20;
    ally.graphics1.fillRectShape(ally.maxHealthBar);
    ally.graphics2 = game.add.graphics({fillStyle: { color: 0xf94d4d } });
    ally.graphics2.setDepth(spawnDepth);    
    ally.healthBar = new Phaser.Geom.Rectangle();
    ally.healthBar.width = ally.maxHealthBar.width;
    ally.healthBar.height = ally.maxHealthBar.height;
    ally.healthBar.x = ally.maxHealthBar.x;
    ally.healthBar.y = ally.maxHealthBar.y;
    ally.graphics2.fillRectShape(ally.healthBar);

     // emitter
     bloodParticle = game.add.particles('blood'); 
     ally.emitter = bloodParticle.createEmitter({
         speed: 50,
         scale: {start: .1, end: 0},
     });
     ally.emitter.startFollow(ally);
     ally.emitter.setVisible(false);

    // collision
    game.physics.add.collider(wallLayer, ally);
    game.physics.add.collider(obstacleLayer, ally);
    ally.body.collideWorldBounds = true; 
    if(currentScene == scenes.length - 1){
        game.physics.add.collider(lavaLayer, ally);
    }

    disciples.push(ally);
}

function initializePlayer(character, x, y, game){
    if(player != null)
        player.destroy();
    player = game.physics.add.sprite(x, y, character.key); 
    player.body.immovable = true;  
    player.type = character;       
    player.left = false; // checks for direction
    player.right = false;
    player.down = false;
    player.up = true;
    player.maxHealth = character.maxHealth;
    player.health = player.maxHealth;
    player.maxMana = character.maxMana;
    player.mana = player.maxMana;
    player.attackReady = true; // attack cooldown

    // cooldowns
    player.timeStart;
    player.countingUp = false;
    player.countingDown = false;

    player.update = function(){character.update(game)};
    // status bars
        // health
        player.graphics1 = game.add.graphics({fillStyle: { color: 0xb6bbc4 } });
        player.graphics1.setDepth(playerDepth);
        player.maxHealthBar = new Phaser.Geom.Rectangle();
        player.maxHealthBar.width = 80;
        player.maxHealthBar.height = 6;
        player.maxHealthBar.x = player.x - player.maxHealthBar.width / 2;
        player.maxHealthBar.y = player.y + 20;
        player.graphics1.fillRectShape(player.maxHealthBar);
        player.graphics2 = game.add.graphics({fillStyle: { color: 0xf94d4d } });
        player.graphics2.setDepth(playerDepth);
        player.healthBar = new Phaser.Geom.Rectangle();
        player.healthBar.width = player.maxHealthBar.width;
        player.healthBar.height = player.maxHealthBar.height;
        player.healthBar.x = player.maxHealthBar.x;
        player.healthBar.y = player.maxHealthBar.y;
        player.graphics2.fillRectShape(player.healthBar);
        // mana
        player.maxManaBar = new Phaser.Geom.Rectangle();
        player.maxManaBar.width = 80;
        player.maxManaBar.height = 6;
        player.maxManaBar.x = player.x - player.maxManaBar.width / 2;
        player.maxManaBar.y = player.y + 26;
        player.graphics1.fillRectShape(player.maxManaBar);
        player.graphics3 = game.add.graphics({fillStyle: { color: 0x68a2ff } });
        player.graphics3.setDepth(playerDepth);
        player.manaBar = new Phaser.Geom.Rectangle();
        player.manaBar.width = player.maxManaBar.width;
        player.manaBar.height = player.maxManaBar.height;
        player.manaBar.x = player.maxManaBar.x;
        player.manaBar.y = player.maxManaBar.y;
        player.graphics3.fillRectShape(player.manaBar);

    // emitter
        bloodParticle = game.add.particles('blood'); 
        player.emitter = bloodParticle.createEmitter({
            speed: 50,
            scale: {start: .1, end: 0},
        });
        player.emitter.startFollow(player);
        player.emitter.setVisible(false);

    initializePlayerAnimation(game);
}

function initializeNPCAnimation(key, file, index, game){
    if(key == "satan"){
        if(game.anims.get(key + 'FrontMoving') == undefined){
            game.anims.create({
                key: key + 'FrontMoving', // going left
                frames: game.anims.generateFrameNumbers(file, { start: 0, end: 2 }),
                repeat: -1 // animation will loop
            });
        }

        if(game.anims.get(key + 'FrontIdle') == undefined){
            game.anims.create({
            key: key + 'FrontIdle',
            frames: [ { key: file, frame: 1 } ],
            frameRate: 20
            });
        }

        if(game.anims.get(key + 'SideMoving') == undefined){
            game.anims.create({
                key: key + 'SideMoving', 
                frames: game.anims.generateFrameNumbers(file, { start: 3, end: 5 }),
                frameRate: 10,
                repeat: -1 
            });
        }

        if(game.anims.get(key + 'SideIdle') == undefined){
            game.anims.create({
                key: key + 'SideIdle',
                frames: [ { key: file, frame: 4 } ],
                frameRate: 20
            });
        }

        if(game.anims.get(key + 'BackMoving') == undefined){
            game.anims.create({
                key: key + 'BackMoving', 
                frames: game.anims.generateFrameNumbers(file, { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1 
            });
        }

        if(game.anims.get(key + 'BackIdle') == undefined){
            game.anims.create({
                key: key + 'BackIdle',
                frames: [ { key: file, frame: 7 } ],
                frameRate: 20
            });
        }
    }
    else{
        var startIndex = (index % 4) * 3 + (Math.floor(index / 4) * 36);
        if(game.anims.get(key + 'FrontMoving') == undefined){
            game.anims.create({
                key: key + 'FrontMoving', // going left
                frames: game.anims.generateFrameNumbers(file, { start: startIndex, end: startIndex + 2 }),
                repeat: -1 // animation will loop
            });
        }

        if(game.anims.get(key + 'FrontIdle') == undefined){
            game.anims.create({
            key: key + 'FrontIdle',
            frames: [ { key: file, frame: startIndex + 1 } ],
            frameRate: 20
            });
        }

        if(game.anims.get(key + 'SideMoving') == undefined){
            game.anims.create({
                key: key + 'SideMoving', 
                frames: game.anims.generateFrameNumbers(file, { start: startIndex + 12, end: startIndex + 12 + 2 }),
                frameRate: 10,
                repeat: -1 
            });
        }

        if(game.anims.get(key + 'SideIdle') == undefined){
            game.anims.create({
                key: key + 'SideIdle',
                frames: [ { key: file, frame: startIndex + 12 + 1 } ],
                frameRate: 20
            });
        }

        if(game.anims.get(key + 'BackMoving') == undefined){
            game.anims.create({
                key: key + 'BackMoving', 
                frames: game.anims.generateFrameNumbers(file, { start: startIndex + 24, end: startIndex + 24 + 2 }),
                frameRate: 10,
                repeat: -1 
            });
        }

        if(game.anims.get(key + 'BackIdle') == undefined){
            game.anims.create({
                key: key + 'BackIdle',
                frames: [ { key: file, frame: startIndex + 24 + 1 } ],
                frameRate: 20
            });
        }
    }
}

function initializePlayerAnimation(game){
    if(game.anims.get('playerFrontMoving') == undefined){
        game.anims.create({
            key: 'playerFrontMoving', // going left
            frames: game.anims.generateFrameNumbers('religious', { start: 0, end: 2 }), // frames 0 to 3 on sprite sheet
            frameRate: 10,
            repeat: -1 // animation will loop
        });
    }

    if(game.anims.get('playerFrontIdle') == undefined){
        game.anims.create({
            key: 'playerFrontIdle',
            frames: [ { key: 'religious', frame: 1 } ],
            frameRate: 20
        });
    }

    if(game.anims.get('playerSideMoving') == undefined){    
        game.anims.create({
            key: 'playerSideMoving', 
            frames: game.anims.generateFrameNumbers('religious', { start: 12, end: 14 }), 
            frameRate: 10,
            repeat: -1 // animation will loop
        });
    }

    if(game.anims.get('playerSideIdle') == undefined){
        game.anims.create({
            key: 'playerSideIdle',
            frames: [ { key: 'religious', frame: 13 } ],
            frameRate: 20
        });
    }

    if(game.anims.get('playerBackMoving') == undefined){
        game.anims.create({
            key: 'playerBackMoving',
            frames: game.anims.generateFrameNumbers('religious', { start: 24, end: 26 }), 
            frameRate: 10,
            repeat: -1 // animation will loop
        });
    }

    if(game.anims.get('playerBackIdle') == undefined){
        game.anims.create({
            key: 'playerBackIdle',
            frames: [ { key: 'religious', frame: 25 } ],
            frameRate: 20
        });
    }
}

function initializeCamera(game){
    //set bounds so the camera won't go outside the game world
    game.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels );

    //make the camera follow the player
    game.cameras.main.startFollow(player);

    //set background color, so the sky is not black
    game.cameras.main.setBackgroundColor('#ccccff');
}

function initializeCollisions(game){    
    //set the boundaries of game world
    game.physics.world.bounds.width = groundLayer.width;
    game.physics.world.bounds.height = groundLayer.height; 

    //Collision between wall and player
    game.physics.add.collider(wallLayer, player);
    
    // collision between falling layer and player
    game.physics.add.collider(obstacleLayer, player);

    // collision between boundary and player
    player.body.collideWorldBounds = true;    

    // collision between player and door
    game.physics.add.collider(doorLayer, player);
}

function initializeControls(game){
    cursors = game.input.keyboard.createCursorKeys();
    // custom key binds
    keyP = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P); // pause
    keyR = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); // restart
    keyM = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M); // spell
}

function initializeUI(game){
    // paused text
    pausedText = game.add.text(500, 300, '', { fontSize: '50px', fill: '#ffffff'});
    pausedText.setScrollFactor(0);
    pausedText.setDepth(currentDepth);
}

function initializeAudio(game){
    bulletFX = game.sound.add( 'bulletFX' );
}

function spawnAllies(game){
    // record ally types
    var temp = [];
    disciples.forEach(function(element){
        temp.push(element.type);
    })

    // clear disciples
    disciples = [];

    // re-initialize disciples
    temp.forEach(function(element){
        initializeAlly(element, player.x, player.y, game);
    })
}

function update(game){
    // paused
    if(paused){
        if(game.input.keyboard.checkDown(keyP, 250)){ 
            paused = false;
            game.physics.resume();
            pausedText.setText('');
        }
    }
    // active game
    else if(!gameOver){
        player.update();
        
        // NPCs
            // allies
            disciples.forEach(function(element){
                element.update();
            });
            // enemies
            enemies.forEach(function(element) {
                element.update();
            });

        // check map cleared
        if(!gameOver && enemies.length == 0){
            doorLayer.setVisible(true);
            doorLayer.setCollisionByExclusion([0]);
            if(currentScene == scenes.length - 1){
                gameStatus = game.add.image(480, 300, 'win');
                gameStatus.setDepth(currentDepth);
                gameStatus.setScrollFactor(0);
            }
        }
    }
    // game over
    else{
        if(game.input.keyboard.checkDown(keyR, 250)){ // restart
            game.scene.restart();

            gameOver = true;
        } 
    }
}

function updatePlayerBars(){
    // health
    player.healthBar.width = (player.maxHealthBar.width / player.maxHealth) * player.health;
    player.graphics1.clear();
    player.graphics2.clear();
    player.maxHealthBar.x = player.x - player.maxHealthBar.width / 2;
    player.maxHealthBar.y = player.y + 20;
    player.graphics1.fillRectShape(player.maxHealthBar);
    player.healthBar.x = player.maxHealthBar.x;
    player.healthBar.y = player.maxHealthBar.y;
    player.graphics2.fillRectShape(player.healthBar);
    
    // mana
    player.manaBar.width = (player.maxManaBar.width / player.maxMana) * player.mana;
    player.graphics3.clear();
    player.maxManaBar.x = player.x - player.maxManaBar.width / 2;
    player.maxManaBar.y = player.y + 26;
    player.graphics1.fillRectShape(player.maxManaBar);
    player.manaBar.x = player.maxManaBar.x;
    player.manaBar.y = player.maxManaBar.y;
    player.graphics3.fillRectShape(player.manaBar);
}

function updateHealthBar(target){
    target.healthBar.width = (target.maxHealthBar.width / target.maxHealth) * target.health;
    target.graphics1.clear();
    target.graphics2.clear();
    target.maxHealthBar.x = target.x - target.maxHealthBar.width / 2;
    target.maxHealthBar.y = target.y + 20;
    target.graphics1.fillRectShape(target.maxHealthBar);
    target.healthBar.x = target.maxHealthBar.x;
    target.healthBar.y = target.maxHealthBar.y;
    target.graphics2.fillRectShape(target.healthBar);
}

function moveX(entity, speed){
    // left
    if(speed < 0){
        // direction check
        entity.right = false;
        entity.left = true;
        //flip image horizontally
        entity.flipX = false;
    }
    // right
    else{
        // direction check
        entity.right = true;
        entity.left = false;
        //flip image horizontally
        entity.flipX = true;
    }

    //activate animation
    entity.anims.play(entity.type.key + 'SideMoving', true);
    // change velocity
    entity.setVelocityX(speed);
}

function moveY(entity, speed){
    // up
    if(speed < 0){
        // direction check
        entity.down = false;
        entity.up = true;
        //activate animation
        entity.anims.play(entity.type.key + 'BackMoving', true);
    }
    // down
    else{
        // direction check
        entity.down = true;
        entity.up = false;
        //activate animation
        entity.anims.play(entity.type.key + 'FrontMoving', true);
    }

      // change velocity
      entity.setVelocityY(speed);
}

function playSound( sound ){
    sound.play();
}

function checkComplete(game){
    if(keyM.isDown && currentScene != scenes.length - 1){ 
        game.scene.start(scenes[++currentScene]);
    }
}

function nextLevel(game){
    disciples.forEach(function(element){
        element.type.projectiles = [];
    })
    backup = disciples;
    timerEvents.push(game.time.addEvent({delay: 500, callback: function(){
        game.scene.start(scenes[++currentScene]);
    }}));
}

function setGameOver(game){ 
    game.physics.pause();
    gameOver = true;
    gameStatus = game.add.image(480, 300, 'gameOver');
    gameStatus.setDepth(currentDepth);
    gameStatus.setScrollFactor(0);
    enemies = [];
    disciples = [];
}