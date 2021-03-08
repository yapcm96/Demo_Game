import {Enemy} from './Enemy.js'
import chalk from 'chalk';


// ES6 Syntax
export class Snake extends Enemy {
    constructor(name, weapon) {
        // Call parent constructor here:
        super(name, weapon);
        
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
    }
}