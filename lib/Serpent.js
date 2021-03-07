//const Potion = require('./Potion');
//const Enemy = require('./Character');

import {Potion} from './Potion.js';
import {Character} from './Character.js';
import {Enemy} from './Enemy.js'
import chalk from 'chalk';

// ES6 Syntax
export class Snake extends Enemy {
    constructor(name, weapon) {
        // Call parent constructor here:
        super(name, weapon);
        
        // this.weapon = weapon;
        // this.potion = new Potion();
        this.armor = 'Silver Scales';
        this.type = 'Earth';
        this.item = 'Lifesteal Fang';
        this.sprite = `
            :===-- ..         
          .==-=+=*+==         
          +=*#+===+*+         
         :++${chalk.red('*#')}:=+++${chalk.red('#')}=         
          =+***=:+#+.         
           =*++++=-: ${chalk.red('.::: ')}    
            :+*+--===+-.      
    .---:-+**##*+---=+*+=:    
   ==+++++**#%%%*=---=*###:   
  :==+++**+#*##%*=---==****:  
  :+**#*****=***+==--=+*%#+:  
   =#*+#******++=++++++#*.    
   ==+=====+*****##***##*:    
  :::========++******+=:.     
   .:-=---==:-=+=++-.          `;
        // this.status = 'Poisoned';

        // whatever ideas
    }

}

// module.exports = Cyclops;