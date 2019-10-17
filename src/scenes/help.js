var currentPage = 0;
var text1, text2;

var overlay;
var title;
var text;
var titles = ['controlsTitle', 'mechanicsTitle', 'alliesTitle'];
var texts = ['controls', 'mechanics', 'allies'];

var background;
var btnHome;
var btnNext;
var btnBack;

var helpScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function SceneHelp ()
        {
            Phaser.Scene.call(this, { key: 'help' });
        },

    preload: 
        function (){
            currentPage = 0;
        },
    create: 
        function (){
            // background
            this.add.image(480, 350, 'background');

            // overlay
            overlay = this.add.image(480, 350, 'overlay');
            overlay.setAlpha(.4, .4, .4, .4);

            // title
            title = this.add.image(480, 100, 'controlsTitle');

            // text
            text = this.add.image(480, 380, 'controls');
            //printControls(this);

            // home button
            btnHome = this.add.sprite(50, 50, 'homeButtonNormal').setInteractive();
            btnHome.on('pointerout', function (event) { 
                btnHome.setTexture('homeButtonNormal');
            });
            btnHome.on('pointerdown', function(event){
                btnHome.setTexture('homeButtonClicked');
            }); 
            btnHome.on('pointerup', function(event){
                this.scene.start('menu');
                currentScene = 0;
            }, this); 

            // next button
            btnNext = this.add.sprite(800, 630, 'nextButtonNormal').setInteractive();
            btnNext.on('pointerout', function (event) { 
                btnNext.setTexture('nextButtonNormal');
            });
            btnNext.on('pointerdown', function(event){
                btnNext.setTexture('nextButtonClicked');
            }); 
            btnNext.on('pointerup', function(event){
                btnNext.setTexture('nextButtonNormal');
                nextPage(this);
            }, this); 

            // back button
            btnBack = this.add.sprite(170, 630, 'backButtonNormal').setInteractive();
            btnBack.on('pointerout', function (event) { 
                btnBack.setTexture('backButtonNormal');
            });
            btnBack.on('pointerdown', function(event){
                btnBack.setTexture('backButtonClicked');
            }); 
            btnBack.on('pointerup', function(event){
                btnBack.setTexture('backButtonNormal');
                previousPage(this);
            }, this); 
            btnBack.setVisible(false);
        }
});

function nextPage(game){
    currentPage++;
    if(currentPage == 1){
        btnNext.setVisible(true);
        btnBack.setVisible(true);
    }
    else if(currentPage == 2){
        btnNext.setVisible(false);
        btnBack.setVisible(true);
    }

    title.setTexture(titles[currentPage]);
    text.setTexture(texts[currentPage]);
}

function previousPage(game){
    currentPage--;
    if(currentPage == 0){
        btnNext.setVisible(true);
        btnBack.setVisible(false);
    }
    else if(currentPage == 1){
        btnNext.setVisible(true);
        btnBack.setVisible(true);
    }

    title.setTexture(titles[currentPage]);
    text.setTexture(texts[currentPage]);
}
