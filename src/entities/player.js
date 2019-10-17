function character(){
    this.key = 'player';
    this.maxHealth = 100;
    this.maxMana = 50;
    this.speed = 200;
    this.damage = 15;
    this.invulnerable = false;
    this.update = function(game){
        // game over
        if(player.health <= 0){
            player.health = 0;
            setGameOver(game);
        }

        if(player.health > player.type.maxHealth){
            player.health = player.type.maxHealth;
        }
        if(player.mana < 0){
            player.mana = 0;
        }
        if(player.mana > player.type.maxMana){
            player.mana = player.type.maxMana;
        }

        // INPUT
            // pause
            if(game.input.keyboard.checkDown(keyP, 250)){
                paused = true;
                game.physics.pause();
                pausedText.setText('PAUSED');
            }

            // MOVEMENT
                // idle
                if(!(cursors.right.isDown || cursors.left.isDown || cursors.up.isDown || cursors.down.isDown)){
                    if(player.left){
                        player.anims.play('playerSideIdle', true);
                        player.flipX = false;
                    }
                    else if(player.right){
                        player.anims.play('playerSideIdle', true);
                        player.flipX = true;
                    }
                    else if(player.up){
                        player.anims.play('playerBackIdle', true);
                    }
                    else if(player.down){
                        player.anims.play('playerFrontIdle', true);
                    }
                    player.right = false;
                    player.left = false;
                    player.up = false;
                    player.down = false;
                    player.setVelocityX(0);
                    player.setVelocityY(0);
                }
                else{
                    // left and right
                    if (cursors.left.isDown){
                        moveX(player, -this.speed);
                    }
                    else if (cursors.right.isDown){
                        moveX(player, this.speed);
                    }
                    else
                        player.setVelocityX(0);

                    // up and down
                    if (cursors.up.isDown){
                        moveY(player, -this.speed);
                    }
                    else if (cursors.down.isDown){
                        moveY(player, this.speed);
                    }
                    else
                        player.setVelocityY(0);
                }
            
            // SPELL
                if(cursors.space.isDown){
                    if(player.mana > 0){
                        player.countingUp = false;
                        spell.setVisible(true);
                        spell.setActive(true);
                        spellActive = true;
                        if(!player.countingDown){
                            player.countingDown = true;
                            player.startTime = game.sys.game.loop.time;
                        }
                        else if(player.countingDown && game.sys.game.loop.time - player.startTime >= 70){
                            player.mana--;
                            player.startTime = game.sys.game.loop.time;
                        }
                    }
                    else{
                        spell.setVisible(false);
                        spell.setActive(false);
                        spellActive = false;
                    }
                }
                else{
                    player.countingDown = false;
                    spell.setVisible(false);
                    spell.setActive(false);
                    spellActive = false;
                    if(player.mana < this.maxMana){
                        if(!player.countingUp){
                            player.countingUp = true;
                            player.startTime = game.sys.game.loop.time;
                        }
                        else if(player.countingUp && game.sys.game.loop.time - player.startTime >= 500){
                            player.mana++;
                            player.manaBar.width = (player.maxManaBar.width / player.maxMana) * player.mana;
                            player.startTime = game.sys.game.loop.time;
                        }
                    }
                }

                if(spellActive){
                    spell.x = player.x;
                    spell.y = player.y;
                }

            // HEALTH BAR
            updatePlayerBars();
            // if(keyM.isDown && currentScene != scenes.length - 1){ 
            //     //game.scene.stop(scenes[currentScene]);
            //     game.scene.start(scenes[++currentScene]);
            // }
    }
}