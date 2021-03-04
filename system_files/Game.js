const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
    this.roundNumber = 0
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
};

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('three headed wolf', 'claw'));
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

Game.prototype.startNewBattle = function() {
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

Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Tame', 'Use Revive']
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
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({ action }) => {
                            const reviveDetails = action.split(': ');

                            this.player.useRevive(reviveDetails[0] - 1);
                            console.log(`You used a ${reviveDetails[1]} Beyonce (revive).`);

                            this.checkEndOfBattle();
                        });
                } else {
                    // Player attacks
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    console.log(`You attacked the ${this.currentEnemy.name}`);
                    console.log(this.currentEnemy.getHealth());

                    this.checkEndOfBattle();
                }
            });
    } else {
        // Enemy attacks
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};

Game.prototype.checkEndOfBattle = function() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);

        this.player.addRevive(this.currentEnemy.revive);
        console.log(`${this.player.name} found a(n) ${this.currentEnemy.revive.name} Beyonce`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        }
    } else {
        console.log("You've been defeated!");
    }
};

module.exports = Game;