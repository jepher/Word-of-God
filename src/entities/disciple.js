function disciple(){
    this.key = 'disciple';
    this.maxHealth = 50;
    this.speed = 200;
    this.invulnerable = false;
    this.followDistance = 100;
    this.moveDelay = (Math.random() * 1000) + 500;
    this.file = 'religious';
    this.index = 1;
    this.update = function(ally, game){
        if(!gameOver){
            // check alive
            if(ally.health <= 0){
                ally.graphics1.destroy();
                ally.graphics2.destroy();
                ally.destroy();
                disciples.splice(disciples.indexOf(ally), 1);
                return;
            }

            // come to player
            if(Math.sqrt(Math.pow(ally.x - player.x, 2) + Math.pow(ally.y - player.y, 2)) >= this.followDistance){
                ally.counting = false;

                ally.angle = BetweenPoints(ally, player);
                SetToAngle(ally.line, player.x, player.y, ally.angle, 128);
                velocityFromRotation(ally.angle, this.speed, ally.velocity);
                moveX(ally, ally.velocity.x);
                moveY(ally, ally.velocity.y);
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
                else{
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
            }
            updateHealthBar(ally);
        }
    }
}