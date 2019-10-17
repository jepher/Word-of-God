function ghost(){
    this.key = 'ghost';
    this.maxHealth = 150;
    this.speed = 30;
    this.range = 300;
    this.aggro = 200;
    this.attackDelay = 1000;
    this.moveDelay = (Math.random() * 1000) + 500;
    this.file = 'demons';
    this.index = 0;
    this.attack = function(enemy, game){
        //playSound(bulletFX);
        var projectile = game.physics.add.image(enemy.x, enemy.y, 'ghostBlast');
        projectile.setDepth(spawnDepth);
        projectile.damage = 30;
        projectile.speed = 100;
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
            projectile.destroy();
        }, null, game);
    
        disciples.forEach(function(element){
            game.physics.add.collider(projectile, element, function(){
                element.emitter.setVisible(true); // blood effect
    
                timerEvents.push(game.time.addEvent({delay: 200, callback: function(){ // end blood effect
                    element.emitter.setVisible(false);
                }}));
                element.health -= projectile.damage; // decrease health
                projectile.destroy();
            }, null, game);
        });
        game.physics.add.collider(projectile, obstacleLayer, function(){projectile.destroy()}, null, game);

        enemy.counting = false;
    };
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
                initializeAlly(new apostle(), x, y, game);
                return;
            }

            // check attacking
            if(Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) <= this.aggro){
                enemy.attacking = true;
            }
            else{
                enemy.attacking = false;
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
                
                if(!enemy.counting){
                    enemy.counting = true;
                    enemy.startTime = game.sys.game.loop.time;
                }
                    
                if(game.sys.game.loop.time - enemy.startTime >= this.attackDelay){
                    this.attack(enemy, game);
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
                if(!enemy.counting){
                    enemy.counting = true;
                    this.moveDelay = (Math.random() * 1000) + 500;
                    enemy.direction = Math.floor(Math.random() * 4);
                    enemy.startTime = game.sys.game.loop.time;
                }
                    
                if(game.sys.game.loop.time - enemy.startTime >= this.moveDelay){
                    if(enemy.direction == 0){
                        moveY(enemy, 0);
                        moveX(enemy, -this.speed);
                    }
                    else if(enemy.direction == 1){
                        moveY(enemy, 0);
                        moveX(enemy, this.speed);
                    }
                    else if(enemy.direction == 2){
                        moveX(enemy, 0);
                        moveY(enemy, -this.speed);
                    }
                    else if(enemy.direction == 3){
                        moveX(enemy, 0);
                        moveY(enemy, this.speed);
                    }
                    enemy.counting = false;
                }
            }

            // health
            updateHealthBar(enemy);
        }
    }
}