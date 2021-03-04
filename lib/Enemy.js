//const Potion = require('./Potion');
//const Character = require('./Character');
import {Potion} from './Potion.js';
import {Character} from './Character.js';


export class Enemy extends Character {
    constructor(name, weapon) {
        // Call parent constructor here:
        super(name);
        
        this.weapon = weapon;
        this.potion = new Potion();

    }

    // Describes initial and preceding enemies name and weapon attributes
    getDescription() {
        return `A ${this.name} holding a ${this.weapon} has appeared!`;
    }
}

// module.exports = Enemy;