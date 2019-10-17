function lich(satan){
    this.key = 'lich';

    this.maxHealth = 1500;
    this.speed = 0;

    this.healthHeal = 100;
    this.healDelay = 5000;

    this.projectiles = [];

    this.file = 'demons';
    this.index = 4;

    this.heal = function(enemy, game){
        // change animation
        if(Math.abs(satan.x - enemy.x) > Math.abs(satan.y - enemy.y)){
            enemy.anims.play(this.key + 'SideIdle', true);
            if(satan.x > enemy.x)
                enemy.flipX = true;
            else 
                enemy.flipX = false;
        }
        else {
            if(satan.y > enemy.y)
                enemy.anims.play(this.key + 'FrontIdle', true);
            else 
                enemy.anims.play(this.key + 'BackIdle', true);
        }

        var projectile = game.physics.add.image(enemy.x, enemy.y, 'lichHeal');
        projectile.setDepth(spawnDepth);
        projectile.speed = 70;
        projectile.velocity = new Phaser.Math.Vector2();
        projectile.line = new Phaser.Geom.Line();
        projectile.angle = BetweenPoints(enemy, satan);
        SetToAngle(projectile.line, enemy.x, enemy.y, projectile.angle, 128);
        velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
        projectile.setAngle(projectile.angle * (180 / Math.PI));
        projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
        
        // COLLIDERS
            // disciples
            disciples.forEach(function(element){
                game.physics.add.overlap(projectile, element, function(){
                    element.emitter.setVisible(true); // hit effect

                    timerEvents.push(game.time.addEvent({delay: 500, callback: function(){ // end hit effect
                        element.emitter.setVisible(false);
                    }}));

                    var temp = element.type.speed;
                    element.type.speed = 0;
                    element.setTint(0xcc0000);
                    timerEvents.push(game.time.addEvent({delay: 2000, callback: function(){ 
                        element.speed = temp;
                        element.setTint(0xffffff);
                    }}));
                }, null, game);
            });
            game.physics.add.collider(projectile, satan, function(){
                satan.health += enemy.type.healthHeal; // heal
    
                // destroy
                enemy.type.projectiles.splice(enemy.type.projectiles.indexOf(projectile), 1);
                projectile.destroy();
            }, null, game);
            // hit wall
            game.physics.add.collider(projectile, groundLayer, function(){
                ally.type.projectiles.splice(ally.type.projectiles.indexOf(projectile), 1);
                projectile.destroy();
            }, null, game);   
    
        projectile.update = function(){
            projectile.angle = BetweenPoints(projectile, satan);
            SetToAngle(projectile.line, projectile.x, projectile.y, projectile.angle, 128);
            velocityFromRotation(projectile.angle, projectile.speed, projectile.velocity);
            projectile.setAngle(projectile.angle * (180 / Math.PI));
            projectile.setVelocity(projectile.velocity.x, projectile.velocity.y);
        }
        enemy.type.projectiles.push(projectile);
    
        enemy.counting = false;
    }
    this.update = function(enemy, game){
        if(!gameOver){
            // check alive
            if(enemy.health <= 0){
                enemy.graphics1.destroy();
                enemy.graphics2.destroy();
                enemy.emitter.setVisible(false);
                enemies.splice(enemies.indexOf(enemy), 1);
                enemy.destroy();
                return;
            }

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
            if(satan.health < satan.maxHealth){
                if(game.sys.game.loop.time - enemy.startTime >= this.healDelay){
                    // HEAL
                        this.heal(enemy, game);
                        enemy.startTime = game.sys.game.loop.time;
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

