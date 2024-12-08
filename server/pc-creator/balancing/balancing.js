/* eslint-disable */
const Utils = require('../utils');

const throwDice = (n) => {
    const results = [0];
    for (let i = 0; i < n; i += 1) {
      results.push(Utils.rand(1,6));
    }
    return results.reduce((partialSum, a) => partialSum + a);
  };

const trials = (forCounts, diceA, diceB) => {
    const pA = {
        wins: 0,
        lose: 0,
        dices: diceA
    }
    
    const pB = {
        wins: 0,
        lose: 0,
        dices: diceB
    }
    let even = 0;

    Utils.forCount(forCounts, () => {
        let a = throwDice(pA.dices);
        let b = throwDice(pB.dices);
    
        if(a>b){
            pA.wins++;
            pB.lose++;
        }
        if (a===b){
            even++
        }
        if(b>a){
            pA.lose++;
            pB.wins++;
        }
    })
    console.log(`In ${forCounts} matches with ${diceA} dices for Player A and ${diceB} for Player B`)
    console.log('Player A', pA)
    console.log('Player B', pB)
    console.log('Evens', even)
}


trials(10000,6,4)