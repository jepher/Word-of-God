function thug(){
    this.key = 'thug';
    this.maxHealth = 50;
    this.speed = 70;
    this.range = 300;
    this.aggro = 300;
    this.attackDelay = 1000;
    this.moveDelay = 2200;
    this.file = 'thugs';
    this.index = 3;
    this.attack = function(enemy, game){
        //playSound(bulletFX);
        var projectile = game.physics.add.image(enemy.x, enemy.y, 'bullet');
        projectile.speed = 100;
        projectile.damage = 10;
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
                initializeAlly(new disciple(), x, y, game);
                return;
            }

            // check attacking
            if(Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) <= this.aggro){
                enemy.attacking = true;
            }
            else{
                moveX(enemy, -this.speed);
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
                    enemy.counting = false;
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

            // health
            updateHealthBar(enemy);
        }
    }
}