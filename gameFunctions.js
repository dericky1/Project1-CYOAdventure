const { findPlayerById, createPlayer, updatePersonById, createNPC, findNPCById, updateNPCById } = require("./mongoDb");

let gameState = {
    name: '',
    lives: 0,
    role: '',
    HP: 100

}

let golemState = {
    name:'Golem',
    HP: 10
}

// Choose Class
function chooseClass(role) {
    if((role === 'Warrior') || ( role === "warrior")){
        let chosenClass = ({message:'You are a Warrior. Go to "http://localhost:5000/dungeonEntrance" to continue.', role: 'Warrior'})
        // console.log(chosenClass);
        updatePersonById(gameState._id, {role: chosenClass.role});
        // console.log(gameState._id)
        return chosenClass.message
    } else if ((role === 'Mage') || (role === 'mage')) {
        let chosenClass = ({message: 'You are a Mage. Go to "http://localhost:5000/dungeonEntrance" to continue.', role: 'Mage'})
        updatePersonById(gameState._id, {role: chosenClass.role});
        // console.log(gameState._id)
        return chosenClass.message
    } else {
        return({message:'You did not choose a proper class please pick again.', role: ''})
    }
}

function randomDice (){
    return Math.floor(Math.random()*9)
}

function golemCombatRoll(lifeCount) {
    let roll = randomDice();
    if (roll >= 3 ) { 
        message = 'You have defeated the Golem move to the next stage at: ----------'
        return message
    }
    else {
        message = 'You have died and lost a life retry at: ----------'
        updatePersonById(gameState._id, {lives: lifeCount - 1})
        return message
    }
}

// Golem

const attack = async (golemStateId) => {
    // let currentGolemState = await findNPCById(golemStateId)
    // currentGolemState = await updateNPCById(currentGolemState._id, {HP: currentGolemState.HP -5})
    // golemState = currentGolemState;
    golemState = await findNPCById(golemStateId);
    await updateNPCById(golemState._id, {HP: golemState.HP -5})
    golemState = await findNPCById(golemStateId);
    console.log('golemState is: ', golemState)
    // if (currentGolemState.HP <= 0) {
    //     return ('The golem has been defeated')
    // }
    return golemState
}

// Load previous game
const loadGameState = async (id) => {
    let loadedGameState = await findPlayerById(id);
    // console.log(loadedGameState)
    gameState = loadedGameState;
    // console.log('gameState is: ' , gameState);
    return gameState
};


// Create new game
const createGameState = async (name) => {
    let newGameState = await createPlayer({
        name: name,
        lives: 3,
        role: '',
        HP: 100
    });
    let newGameId = newGameState.insertedId;
    let game = await findPlayerById(newGameId);
    gameState = game;
    // console.log('gameState is: ', gameState)
    return gameState
}

// Create NPC
const createGolem = async (name) => {
    let newNPCState = await createNPC({
        name: name,
        HP: 10
    });
    let newNPCId = newNPCState.insertedId;
    let golem = await findNPCById(newNPCId);
    golemState = golem;
    return golemState
}

module.exports = {chooseClass, randomDice, golemCombatRoll, loadGameState, createGameState, createGolem, attack}
