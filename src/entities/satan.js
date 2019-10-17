function satan(game){
    this.key = 'satan';
    this.maxHealth = 6000;
    this.speed = 0;
    this.active = false;
    // attack
    this.range = 500;
    this.aggro = 500;
    this.attackCounter1 = game.sys.game.loop.time;
    this.attackDelay1 = 5000;
    this.attackCounter2 = game.sys.game.loop.time;
    this.attackDelay2 = 9000;
    this.attackCounter3 = game.sys.game.loop.time;
    this.attackDelay3 = 15000;
    this.attackDuration3 = 5000;
    this.attackActive3 = false;
    this.attackStart3;
    this.projectiles = [];

    this.moveDelay = 2200;
    this.file = 'satan';
    this.index = 0;
    this.attack1 = function(enemy, game){
        var shots = 12;
        for(var i = 0; i < shots; i++){
            let projectile = game.physics.add.image(enemy.x, enemy.y, 'satanBlast').setScale(2);
            projectile.setDepth(spawnDepth);
            projectile.startTime = game.sys.game.loop.time;
            projectile.damage = 90;
            projectile.speed = 70;
            projectile.velocity = new Phaser.Math.Vector2();
            projectile.line = new Phaser.Geom.Line();
            projectile.angle = BetweenPoints(enemy, player) - (shots / 2) * (Math.PI / 6) + (Math.PI / 6) * i;
            SetToAngle(projectile.line, enemy.x, enemy.y, projectile.angle, 128);
            velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
            projectile.setAngle(projectile.angle * (180 / Math.PI));
            projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
            
            // COLLIDERS
                // player
                game.physics.add.collider(projectile, player, function(){
                    player.health -= projectile.damage; 
    
                    // destroy
                    enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                    projectile.destroy();
                }, null, game);
                // disciples
                disciples.forEach(function(element){
                    game.physics.add.collider(projectile, element, function(){
                        element.emitter.setVisible(true); // hit effect
    
                        timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                            element.emitter.setVisible(false);
                        }}));
                        element.health -= projectile.damage; // decrease health
    
                        // destroy
                        enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                        projectile.destroy();
                    }, null, game);
                });
                // hit wall
                game.physics.add.collider(projectile, obstacleLayer, function(){
                    enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                    projectile.destroy();
                }, null, game);   
            enemy.type.projectiles.push(projectile); 
        }
    
        this.attackCounter1 = game.sys.game.loop.time;
    }
    this.attack2 = function(enemy, game){
        function explode(x, y){
            var shots = 12;
            for(var i = 0; i < shots; i++){
                let projectile = game.physics.add.image(x, y, 'satanBomb').setScale(2);
                projectile.setDepth(spawnDepth);
                projectile.damage = 70;
                projectile.speed = 70;
                projectile.velocity = new Phaser.Math.Vector2();
                projectile.line = new Phaser.Geom.Line();
                projectile.angle = (Math.PI / 6) * i;
                SetToAngle(projectile.line, x, y, projectile.angle, 128);
                velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
                projectile.setAngle(projectile.angle * (180 / Math.PI));
                projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
                
                // COLLIDERS
                    // player
                    game.physics.add.collider(projectile, player, function(){
                        player.health -= projectile.damage; 
        
                        // destroy
                        enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                        projectile.destroy();
                    }, null, game);
                    // disciples
                    disciples.forEach(function(element){
                        game.physics.add.collider(projectile, element, function(){
                            element.emitter.setVisible(true); // hit effect
        
                            timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                                element.emitter.setVisible(false);
                            }}));
                            element.health -= projectile.damage; // decrease health
        
                            // destroy
                            enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                            projectile.destroy();
                        }, null, game);
                    });
                    // hit obstacle
                    game.physics.add.collider(projectile, obstacleLayer, function(){
                        enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                        projectile.destroy();
                    }, null, game); 
                    // hit wall
                    game.physics.add.collider(projectile, wallLayer, function(){
                        enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                        projectile.destroy();
                    }, null, game);   
                enemy.type.projectiles.push(projectile); 
            }
        }
        //playSound(bulletFX);
        var projectile = game.physics.add.image(enemy.x, enemy.y, 'satanBomb').setScale(5);
        projectile.setDepth(spawnDepth);
        projectile.startTime = game.sys.game.loop.time;
        projectile.damage = 1000;
        projectile.speed = 50;
        projectile.duration = 5000;
        projectile.velocity = new Phaser.Math.Vector2();
        projectile.line = new Phaser.Geom.Line();
        projectile.angle = BetweenPoints(enemy, player);
        SetToAngle(projectile.line, player.x, player.y, projectile.angle, 128);
        velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
        projectile.setAngle(projectile.angle * (180 / Math.PI));
        projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
        
        // add colliders
        game.physics.add.collider(projectile, player, function(){
            player.emitter.setVisible(true); // blood effect
    
            timerEvents.push(game.time.addEvent({delay: 200, callback: function(){ // end blood effect
                player.emitter.setVisible(false);
            }}));
            player.health -= projectile.damage; // decrease health
            enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
            explode(projectile.x, projectile.y);
            projectile.destroy();
        }, null, game);
    
        disciples.forEach(function(element){
            game.physics.add.collider(projectile, element, function(){
                element.emitter.setVisible(true); // blood effect
    
                timerEvents.push(game.time.addEvent({delay: 200, callback: function(){ // end blood effect
                    element.emitter.setVisible(false);
                }}));
                element.health -= projectile.damage; // decrease health
                enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                explode(projectile.x, projectile.y);
                projectile.destroy();
            }, null, game);
        });
        game.physics.add.collider(projectile, obstacleLayer, function(){
            enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
            explode(projectile.x, projectile.y);
            projectile.destroy()
        }, null, game);    

        projectile.update = function(){
            if(game.sys.game.loop.time - projectile.startTime >= projectile.duration){
                enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                explode(projectile.x, projectile.y);
                projectile.destroy();
                return;
            }
    
            projectile.angle = BetweenPoints(projectile, player);
            SetToAngle(projectile.line, projectile.x, projectile.y, projectile.angle, 128);
            velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
            projectile.setAngle(projectile.angle * (180 / Math.PI));
            projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);     
        }
        enemy.type.projectiles.push(projectile); 
        this.attackCounter2 = game.sys.game.loop.time;
    };
    this.attack3 = function(enemy, game){
        for(var i = 0; i < 4; i++){
            let projectile = game.physics.add.image(enemy.x, enemy.y, 'satanLaser');
            projectile.setDepth(spawnDepth);
            projectile.startTime = game.sys.game.loop.time;
            projectile.damage = 80;
            projectile.speed = 70;
            projectile.velocity = new Phaser.Math.Vector2();
            projectile.line = new Phaser.Geom.Line();
            projectile.angle = BetweenPoints(enemy, player) + (Math.PI / 2) * i;
            SetToAngle(projectile.line, enemy.x, enemy.y, projectile.angle, 128);
            velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
            projectile.setAngle(projectile.angle * (180 / Math.PI));
            projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
            
            // COLLIDERS
                // player
                game.physics.add.collider(projectile, player, function(){
                    player.health -= projectile.damage;
    
                    // destroy
                    enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                    projectile.destroy();
                }, null, game);
                // disciples
                disciples.forEach(function(element){
                    game.physics.add.collider(projectile, element, function(){
                        element.emitter.setVisible(true); // hit effect
    
                        timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                            element.emitter.setVisible(false);
                        }}));

                        //freeze
                        var speed = element.type.speed;
                        element.type.speed = 0;
                        timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                            element.type.speed = speed;
                        }}));

                        element.health -= projectile.damage; // decrease health
    
                        // destroy
                        enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                        projectile.destroy();
                    }, null, game);
                });
                // hit obstacle
                game.physics.add.collider(projectile, obstacleLayer, function(){
                    enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                    projectile.destroy();
                }, null, game);

            enemy.type.projectiles.push(projectile); 
        }
        this.attackCounter3 = game.sys.game.loop.time;
    }

    this.update = function(enemy, game){
        if(!gameOver){
            // check alive
            if(enemy.health <= 0){
                enemy.graphics1.destroy();
                enemy.graphics2.destroy();
                enemy.emitter.setVisible(false);
                var x = enemy.x;
                var y = enemy.y;
                enemy.destroy();
                enemies.splice(enemies.indexOf(enemy), 1);
                initializeAlly(new angel(), x, y, game);
                return;
            }
            if(enemy.health > enemy.maxHealth)
                enemy.health = enemy.maxHealth;

            // check aggro
            if(Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) <= this.aggro){
                enemy.attacking = true;
                this.active = true;
            }
            else{
                enemy.attacking = false;
                this.active = false;
            }    

            if(this.active){
                // check attacking
                if(Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) <= this.aggro){
                    enemy.attacking = true;
                    enemy.setActive(true);
                }
                else{
                    enemy.anims.play(this.key + 'FrontIdle', true);
                    enemy.attacking = false;
                    enemy.setActive(false);
                }            

                // attacking
                if(enemy.attacking){
                    // change animation
                    if(Math.abs(player.x - enemy.x) > Math.abs(player.y - enemy.y)){
                        enemy.anims.play(this.key + 'SideIdle', true);
                        if(player.x > enemy.x)
                            enemy.flipX = true;
                        else 
                            enemy.flipX = false;
                    }
                    else {
                        if(player.y > enemy.y)
                            enemy.anims.play(this.key + 'FrontIdle', true);
                        else 
                            enemy.anims.play(this.key + 'BackIdle', true);
                    }

                    enemy.setVelocityX(0);
                    enemy.setVelocityY(0);
                    
                    // attack 1
                    if(game.sys.game.loop.time - this.attackCounter1 >= this.attackDelay1){
                        this.attack1(enemy, game);
                    }
                    // attack 2
                    if(game.sys.game.loop.time - this.attackCounter2 >= this.attackDelay2){
                        this.attack2(enemy, game);
                    }

                    // attack 3
                    if(game.sys.game.loop.time - this.attackCounter3 >= this.attackDelay3 && !this.attackActive3){ // cooldown phase
                        this.attackDelay3 = 500;
                        this.attackActive3 = true;
                        this.attackStart3 = game.sys.game.loop.time;
                    }
                    else if(game.sys.game.loop.time - this.attackCounter3 >= this.attackDelay3 && this.attackActive3){ // active phase
                        this.attack3(enemy, game);
                    }
                    if(this.attackActive3 && game.sys.game.loop.time - this.attackStart3 >= this.attackDuration3){ // end of active phase
                        this.attackDelay3 = 12000;
                        this.attackActive3 = false;
                    }
                }
                else{
                    // idle
                    if(enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0){
                        if(enemy.right){
                            enemy.anims.play(this.key + 'SideIdle', true);
                            enemy.flipX = true;
                        }
                        else if(enemy.left){
                            enemy.anims.play(this.key + 'SideIdle', true);
                            enemy.flipX = false;
                        }
                        else if(enemy.up){
                            enemy.anims.play(this.key + 'BackIdle', true);
                        }
                        else if(enemy.down){
                            enemy.anims.play(this.key + 'FrontIdle', true);
                        }
                    }
                    
                    // moving
                    else{
                        if(enemy.direction == 0){
                            moveX(enemy, -this.speed);
                        }
                        else if(enemy.direction == 1){
                            moveX(enemy, this.speed);
                        }
                        else if(enemy.direction == 2){
                            moveY(enemy, -this.speed);
                        }
                        else if(enemy.direction == 3){
                            moveY(enemy, this.speed);
                        }

                        if(!enemy.counting){
                            enemy.counting = true;
                            enemy.startTime = game.sys.game.loop.time;
                        }
                            
                        if(game.sys.game.loop.time - enemy.startTime >= this.moveDelay){
                            if(enemy.direction == 0)
                                enemy.direction = 1;
                            else if(enemy.direction == 1)
                                enemy.direction = 0;
                            else if(enemy.direction == 2)
                                enemy.direction = 3;
                            else if(enemy.direction == 3)
                                enemy.direction = 2;
                            enemy.counting = false;
                        }
                    }
                }
            }

            //update projectiles
            enemy.type.projectiles.forEach(function(element){
                element.update();
            })

            // health
            updateHealthBar(enemy);
        }
    }
}

