function apostle(){
    this.key = 'apostle';

    this.maxHealth = 500;
    this.speed = 180;
    this.invulnerable = false;

    this.heal = 5;
    this.healDelay = 2000;

    this.damage = 15;
    this.range = 300;
    this.aggro = 300;
    this.attackSpeed = 150;
    this.attackDelay = 1500;
    this.attackDuration = 5000;

    this.followDistance = 100;
    this.moveDelay = (Math.random() * 1000) + 500;

    this.file = 'religious';
    this.index = 2;
    
    this.attack = function(ally, game){
        // find target
        var enemy;
        for(var i = 0; i < enemies.length; i++){
            var element = enemies[i];
            if(Math.sqrt(Math.pow(ally.x - element.x, 2) + Math.pow(ally.y - element.y, 2)) <= ally.type.aggro){
                enemy = element;
                break;
            }
            else{
                ally.counting = false;
                ally.attacking = false;
            }
        }
    
        if(enemy == null){
            ally.counting = false;
            ally.attacking = false;
            return;
        }
    
        // change animation
        if(Math.abs(enemy.x - ally.x) > Math.abs(enemy.y - ally.y)){
        ally.anims.play(this.key + 'SideIdle', true);
        if(enemy.x > ally.x)
            ally.flipX = true;
        else 
            ally.flipX = false;
        }
        else {
            if(enemy.y > ally.y)
                ally.anims.play(this.key + 'FrontIdle', true);
            else 
                ally.anims.play(this.key + 'BackIdle', true);
        }
    
        // create projectile
        var projectile = game.physics.add.image(ally.x, ally.y, 'divineLight');
        projectile.setDepth(spawnDepth);
        projectile.velocity = new Phaser.Math.Vector2();
        projectile.line = new Phaser.Geom.Line();
    
        // set trajectory
        projectile.angle = BetweenPoints(ally, enemy);
        SetToAngle(projectile.line, ally.x, ally.y, projectile.angle, 128);
        velocityFromRotation(projectile.angle, ally.type.attackSpeed, projectile.velocity);
        projectile.setAngle(projectile.angle * (180 / Math.PI));
        projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
        
        // colliders
            // enemies
            enemies.forEach(function(element){
                game.physics.add.collider(projectile, element, function(){
                    element.emitter.setVisible(true); // hit effect
    
                    timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                        element.emitter.setVisible(false);
                    }}));
                    if(!element.type.invulnerable)
                        element.health -= ally.type.damage; // decrease health
    
                    // destroy
                    projectile.destroy();
                }, null, game);
            });
            // obstacles
            game.physics.add.collider(projectile, obstacleLayer, function(){
                projectile.destroy();
            }, null, game);   
    
        ally.counting = false;
    }
    this.update = function(ally, game){
        if(!gameOver){
            // check alive
            if(ally.health <= 0){
                ally.graphics1.destroy();
                ally.graphics2.destroy();
                ally.emitter.setVisible(false);
                disciples.splice(disciples.indexOf(ally), 1);
                ally.destroy();
                return;
            }

            // come to player
            if(Math.sqrt(Math.pow(ally.x - player.x, 2) + Math.pow(ally.y - player.y, 2)) >= this.followDistance){                    
                ally.angle = BetweenPoints(ally, player);
                SetToAngle(ally.line, player.x, player.y, ally.angle, 128);
                velocityFromRotation(ally.angle, this.speed, ally.velocity);
                moveX(ally, ally.velocity.x);
                moveY(ally, ally.velocity.y);
            }

            // check aggro
            for(var i = 0; i < enemies.length; i++){
                var element = enemies[i];
                if(Math.sqrt(Math.pow(ally.x - element.x, 2) + Math.pow(ally.y - element.y, 2)) <= this.aggro){
                    ally.attacking = true;
                    break;
                }
                else
                    ally.attacking = false;
            }

            // attacking
            if(ally.attacking){                
                if(!ally.counting){
                    ally.counting = true;
                    ally.startTime = game.sys.game.loop.time;
                }
                    
                if(game.sys.game.loop.time - ally.startTime >= this.attackDelay){
                    // ATTACK
                        //playSound(bulletFX);
                        this.attack(ally, game);
                }
            }
            else{
                // idle
                if(ally.body.velocity.x == 0 && ally.body.velocity.y == 0){
                    if(ally.right){
                        ally.anims.play(this.key + 'SideIdle', true);
                        ally.flipX = true;
                    }
                    else if(ally.left){
                        ally.anims.play(this.key + 'SideIdle', true);
                        ally.flipX = false;
                    }
                    else if(ally.up){
                        ally.anims.play(this.key + 'BackIdle', true);
                    }
                    else if(ally.down){
                        ally.anims.play(this.key + 'FrontIdle', true);
                    }
                }

                // moving
                if(!ally.counting){
                    ally.counting = true;
                    this.moveDelay = (Math.random() * 1000) + 500;
                    ally.direction = Math.floor(Math.random() * 4);
                    ally.startTime = game.sys.game.loop.time;
                }
                    
                if(game.sys.game.loop.time - ally.startTime >= this.moveDelay){
                    if(ally.direction == 0){
                        moveX(ally, -this.speed);
                    }
                    else if(ally.direction == 1){
                        moveX(ally, this.speed);
                    }
                    else if(ally.direction == 2){
                        moveY(ally, -this.speed);
                    }
                    else if(ally.direction == 3){
                        moveY(ally, this.speed);
                    }
                    ally.counting = false;
                }
            }

            // health
            updateHealthBar(ally);
        }
    }
}

