//const Potion = require('./Potion');
//const Enemy = require('./Character');

import {Potion} from './Potion.js';
import {Enemy} from './Character.js';

// ES6 Syntax
export class Cyclops extends Enemy {
    constructor(name, weapon) {
        // Call parent constructor here:
        super(name);
        
        // this.weapon = weapon;
        // this.potion = new Potion();
        this.armor = TODO;
        this.type = TODO;
        this.status = 'Poisoned';

        // whatever ideas
    }

    // getDescription() {
    //     return `A ${this.name} holding a ${this.weapon} has appeared!`;
    // }
}

// module.exports = Cyclops;

