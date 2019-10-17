function puppet(){
    this.key = 'puppet';
    this.maxHealth = 70;
    this.speed = 50;
    this.moveDelay = (Math.random() * 1000) + 500;
    this.file = 'demons';
    this.index = 3;
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
        
            // health
            updateHealthBar(enemy);
        }
    }
}