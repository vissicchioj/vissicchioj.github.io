var POM;
(function (POM) {
    class GameList {
        constructor() {
            this.correctCounter = 0;
            this.highScore = 0;
            //public startGame: boolean = false;
            this.img1 = new Image(300, 300); // width, height
            this.img2 = new Image(300, 300); // width, height
        }
        init() {
            // Set list of games including their name, score, and image. Score is based off IGN reviews 
            // NOTE: this is a 2D array
            // parseFloat() will be your friend
            this.gameList =
                [
                    ["Mario Golf", "10.0", "./images/mariogolf.png"],
                    ["Pokemon Red", "10.0", "./images/pokemonred.png"],
                    ["The Legend of Zelda: Ocarina of Time", "10", "./images/zeldaoat.png"],
                    ["Super Mario 64", "9.8", "./images/mario64.png"],
                    ["Golden Eye 007", "9.7", "./images/goldeneye.png"],
                    ["Monster Rancher", "9.0", "./images/monsterrancher.png"],
                    ["Tekken 3", "9.3", "./images/tekken3.png"],
                    ["The Sims", "9.5", "./images/sims.png"],
                    ["Legend of Zelda: Majora's Mask", "9.9", "./images/zeldamm.png"],
                    ["Mario Kart 64", "8.1", "./images/mariokart64.png"],
                    ["Final Fantasy 7", "8.2", "./images/ff7.png"],
                    ["Super Smash Bros. Melee", "9.6", "./images/melee.png"],
                    ["Mortal Kombat 3", "5.0", "./images/mortalKombat3.png"],
                    ["Dragon Ball Budokai 3", "8.0", "./images/budokai3.png"],
                    ["NBA Jam Tournament Edition", "6.5", "./images/nbajam.png"],
                    ["Worms Armageddon", "6.0", "./images/wormsarmageddon.png"],
                    ["Fire Emblem Path of Radiance", "8.7", "./images/fepor.png"],
                    ["Fire Emblem The Sacred Stones", "8.5", "./images/fess.png"],
                    ["Dragon Quest V", "8.9", "./images/dq5.png"],
                    ["Pokemon Alpha Sapphire", "7.8", "./images/pokemonas.png"],
                    ["Disgaea: Hour of Darkness", "9.2", "./images/disgaea.png"],
                    ["Sonic The Hedgehog (Sonic '06)", "4.8", "./images/sonic06.png"],
                    ["Demon's Souls", "9.4", "./images/demonsouls.png"],
                    ["Banjo-Kazooie", "9.6", "./images/banjo.png"],
                    ["Billy Hatcher", "7.7", "./images/billyhatcher.png"],
                    ["Sonic Adventure DX Director's Cut", "5.0", "./images/sonicadventure.png"],
                    ["Ultimate Marvel vs. Capcom 3", "8.5", "./images/umvc.png"],
                    ["Hey You, Pikachu!", "6.0", "./images/heyyoupikachu.png"],
                    ["Pokémon Mystery Dungeon: Explorers of Sky", "4.8", "./images/pokemonmd.png"],
                    ["Star Wars Battlefront (2015)", "8.0", "./images/battlefront.png"],
                    ["Minecraft (PC)", "9.0", "./images/minecraft.png"],
                    ["Fortnite: Battle Royale", "9.6", "./images/fortnite.png"],
                    ["Binding of Issac: Rebirth", "9.0", "./images/tboir.png"],
                    ["Metal Gear", "8.0", "./images/metalgear.png"],
                    ["Metal Gear Solid", "9.8", "./images/metalgearsolid.png"],
                    ["Civilization V", "9.0", "./images/civ5.png"],
                    ["Mortal Kombat II", "7.3", "./images/mortalkombat2.png"],
                    ["Mega Man X", "9.0", "./images/megamanx.png"],
                    ["Mega Man Star Force: Dragon", "5.2", "./images/megamansfd.png"],
                    ["Monster Rancher: EVO", "6.5", "./images/monsterrancherevo.png"],
                    ["Dead Island 2", "7.0", "./images/deadisland2.png"],
                    ["One Piece Odyssey", "7.0", "./images/onepieceodyssey.png"],
                    ["Choo Choo Charles", "4.0", "./images/choochoocharles.png"],
                    ["Pokemon Scarlet and Violet", "6.0", "./images/pokemonsv.png"],
                    ["Crash Bandicoot", "7.5", "./images/crash.png"],
                    ["Doom 64", "7.4", "./images/doom64.png"],
                    ["Starfox 64", "8.7", "./images/starfox64.png"],
                    ["Mario Superstar Baseball", "7.9", "./images/mariobaseball.png"],
                    ["The Simpsons Road Rage", "5.1", "./images/simpsonsroadrage.png"],
                    ["Wario Ware Smooth Moves", "8.2", "./images/wariowaresmoothmoves.png"],
                    ["Call of Duty 3", "7.7", "./images/cod3.png"],
                    ["Bakugan Battle Brawlers", "5.8", "./images/bakugan.png"],
                ];
            // var game1 = this.gameList[0];
            // var game2 = this.gameList[1];
            // //document.getElementById('helloMessage').innerHTML = game1[1];
            // //document.getElementById('game1').innerHTML = this.gameList[0][0];
            // var img1 = new Image(300, 300); // width, height
            // // img1.src = this.gameList[0][2];
            // // document.getElementById('game1').appendChild(img1);
            // //document.getElementById('game2').innerHTML = this.gameList[1][0];
            // var img2 = new Image(300, 300); // width, height
            // // img2.src = this.gameList[1][2];
            // // document.getElementById('game2').appendChild(img2);
            // this.setCurrentGames(game1, game2);
            // img1.src = this.currGame1[2];
            // document.getElementById('game1').appendChild(img1);
            // img2.src = this.currGame2[2];
            // document.getElementById('game2').appendChild(img2);
            //this.startGame = true;
            this.correctCounter = 0;
            document.getElementById('correct').innerHTML = "Score: " + this.correctCounter;
            this.randomize(this.gameList);
        }
        compareGames(firstGame, secondGame, choice) {
            if ((parseFloat(firstGame[1]) >= parseFloat(secondGame[1])) && (choice === true)) {
                // Correct answer, continue
                //document.getElementById('helloMessage').innerHTML = "Correct";
                document.getElementById('btnNext').style.visibility = "visible";
                this.correctCounter++;
                //this.randomize(this.gameList);
            }
            else if ((parseFloat(secondGame[1]) > parseFloat(firstGame[1])) && (choice === false)) {
                // Correct answer, continue
                //document.getElementById('helloMessage').innerHTML = "Correct";
                document.getElementById('btnNext').style.visibility = "visible";
                this.correctCounter++;
                //this.randomize(this.gameList);
            }
            else {
                // Incorrect answer, restart game
                //document.getElementById('helloMessage').innerHTML = "Incorrect";
                document.getElementById('btnRestart').style.visibility = "visible";
                //this.randomize(this.gameList);
                this.checkHighscore(this.correctCounter);
            }
            document.getElementById('rating1').innerHTML = this.currGame1[1];
            document.getElementById('rating2').innerHTML = this.currGame2[1];
            document.getElementById('correct').innerHTML = "Score: " + this.correctCounter;
        }
        checkHighscore(score) {
            if (score > this.highScore) {
                this.highScore = score;
                document.getElementById('highscore').innerHTML = "Highscore: " + score;
            }
        }
        randomize(gameList) {
            for (var i = gameList.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = gameList[i];
                gameList[i] = gameList[j];
                gameList[j] = temp;
            }
            this.showGames();
        }
        showGames() {
            var game1 = this.gameList[0];
            var game2 = this.gameList[1];
            this.setCurrentGames(game1, game2);
            this.img1.src = this.currGame1[2];
            document.getElementById('game1').appendChild(this.img1);
            //document.getElementById('game1').innerHTML = this.currGame1[0];
            this.img2.src = this.currGame2[2];
            document.getElementById('game2').appendChild(this.img2);
            //document.getElementById('game2').innerHTML = this.currGame2[0];
            //document.getElementById('helloMessage').innerHTML = "New";
        }
        setCurrentGames(gameDetails1, gameDetails2) {
            this.currGame1 = gameDetails1;
            this.currGame2 = gameDetails2;
        }
        getCurrentGame(gameNum) {
            if (gameNum === 1) {
                return this.currGame1;
            }
            else {
                return this.currGame2;
            }
        }
    }
    POM.GameList = GameList;
})(POM || (POM = {}));
//# sourceMappingURL=games.js.map