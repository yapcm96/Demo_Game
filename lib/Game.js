// const inquirer = require('inquirer');
// const Enemy = require('./Enemy');
// const Player = require('./Player');
import inquirer from 'inquirer'
import {Enemy} from '../lib/Enemy.js'
import {Player} from '../lib/Player.js'
// import {} from '../app.js'

export class Game {
    constructor() {
        this.battleNumber = 0;
        this.isPlayerTurn = false;
        this.enemies = [];
        this.currentEnemy;
        this.player;
        this.roundNumber = 0;
    }

    initializeGame() {
        this.enemies.push(new Enemy('three-headed wolf', 'claw'));
        this.enemies.push(new Enemy('serpent', 'fang'));
        this.enemies.push(new Enemy('skeletocyclops', 'axe'));
        this.currentEnemy = this.enemies[0];

        inquirer
            .prompt({
                type: 'text',
                name: 'name',
                message: 'What is your name?'
            })
            // Destructure name from the prompt object
            .then(({ name }) => {
                this.player = new Player(name);
    
                // Placeholder for starting a new round
                this.startNewBattle();
            });
    
    };
    
    startNewBattle() {
        // let timeout = false;
        
        // setTimeout(function(){
        //     var timeout = true;
        // }, 5000)
        // if (timeout === true) {
        //     return console.log("TIME OUT, GAME OVER!");
        // }
        
        if (this.player.agility > this.currentEnemy.agility) {
            this.isPlayerTurn = true;
        }  else {
            this.isPlayerTurn = false;
        }
    
        console.log('Your stats are as follows:');
        console.table(this.player.getStats());
        console.log(this.currentEnemy.getDescription());

        
        this.battle();


    };
    
    battle() {

        if (this.isPlayerTurn) {
            this.roundNumber++;
            console.log(`---Round ${this.roundNumber}---`);
            inquirer
                .prompt({
                    type: 'list',
                    message: 'What would you like to do?',
                    name: 'action',
                    choices: ['Tame', 'Use Revive', 'Poison', 'Do Nothing']
                })
                .then(({ action }) => {
                    if (action === 'Use Revive') {
                        // No potions to use
                        if (!this.player.getInventory()) {
                            console.log("You don't have any Beyonces (revive) to the left, to the left!");
                            return this.checkEndOfBattle();
                        }
                        
                        // Player uses potion
                        inquirer
                            .prompt({
                                type: 'list',
                                message: 'Which Beyonce (revive) would you like to use?',
                                name: 'action',
                                // utilising map function to specify index and string literal in console
                                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                            })
                            //callback for acceptance / rejection of Promise of specified action
                            .then(({ action }) => {
                                const reviveDetails = action.split(': ');
                                //split ---> ['1','health']
                                // [1, 2, 3, 4]
                                // [ 0th index = 1st index = 2]
                                this.player.useRevive(reviveDetails[0] - 1);
                                console.log(`You used a ${reviveDetails[1]} Beyonce (revive).`);
    
                                this.checkEndOfBattle(); // check again if player still alive
                            });
                    } else if (action === 'Poison') {
                        // Player poisons enemy
                        this.currentEnemy.status = 'Poisoned';
                        console.log(`You poisoned the ${this.currentEnemy.name}`)

                        this.checkEndOfBattle(); // check again if player still alive
                    } else if (action === 'Tame') {
                        // Player tames
                        const damage = this.player.getAttackValue();
                        this.currentEnemy.reduceHealth(damage);
    
                        console.log(`You attacked the ${this.currentEnemy.name}`);
                        console.log(this.currentEnemy.getHealth());
    
                        this.checkEndOfBattle(); // check again if player still alive
                    } else if (action === 'Do Nothing') {
                        console.log(`You flail around like a useless Magikarp. ${this.currentEnemy.name} looks at you confusingly.`);
    
                        this.checkEndOfBattle(); // check again if player still alive
                    }
                });
        } else {
            // Enemy attacks
            const damage = this.currentEnemy.getAttackValue();
            this.player.reduceHealth(damage);
    
            console.log(`You were attacked by the ${this.currentEnemy.name} (${this.currentEnemy.status})`);
            console.log(this.currentEnemy.getHealth());
            console.log(this.player.getHealth());
    
            this.checkEndOfBattle();
        }
    };
    
    
    checkEndOfBattle() {
        // damage if have poisoned status
        this.currentEnemy.getPoisonedDamage();


        // executes if player and enemy is alive
        if (this.player.isAlive() && this.currentEnemy.isAlive()) {
            this.isPlayerTurn = !this.isPlayerTurn;

            this.battle();
        } 
        // executes if player is alive but enemy is dead
        else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
            console.log(`You've defeated the ${this.currentEnemy.name}`);
    
            this.player.addRevive(this.currentEnemy.potion);
            console.log(`${this.player.name} found a(n) ${this.currentEnemy.potion.name} Beyonce`);
    
            this.battleNumber++;
    
            // constraining 'levels' of game to amount of defined enemies
            if (this.battleNumber < this.enemies.length) {
                this.currentEnemy = this.enemies[this.battleNumber];
                this.startNewBattle();
            } else {
                console.log('You win!');
            }
        }
        // if we don't meet the above conditions i.e. player is dead

        else {
            console.log("You've been defeated!");
        }
    };
};



// module.exports = Game;