const { findPlayerById, createPlayer, updatePersonById, createNPC, findNPCById, updateNPCById, createItem, findItemById } = require("./mongoDb");

let gameState = {
    name: '',
    lives: 0,
    role: '',
    HP: 100,
    DMG: 9,

}

let golemState = {
    name:'Golem',
    HP: 10
}

let equipmentState = {
        name: 'Dagger',
        DMG: 10
}

let dragonState = {
    name:'Dragon',
    HP: 100,
    DMG: 15
}


let npcState = {
    name: '',
    HP: 0,
    DMG: 0,

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

// function golemCombatRoll(lifeCount) {
//     let roll = randomDice();
//     if (roll >= 3 ) { 
//         message = 'You have defeated the Golem move to the next stage at: ----------'
//         return message
//     }
//     else {
//         message = 'You have died and lost a life retry at: ----------'
//         updatePersonById(gameState._id, {lives: lifeCount - 1})
//         return message
//     }
// }


const handleCombat = async (gameStateId, npcStateId) => {
    // user attacks npc
    await attack(gameStateId, npcStateId)
    // npc attacks user
    await attack(npcStateId, gameStateId)
    // Get player game state
    gameState = await findPlayerById(gameStateId)
    // Get npc game state
    npcState = await findNPCById(npcStateId)
    // HP checks
    if (gameState.HP <= 0) {
        return ('Oh dear you are dead!')
    } else if (npcState.HP <= 0) {
        return ('You have defeated the dragon. Go to ')
    } else {
        return (`You did ${gameState.DMG} to the dragon. The dragon attacked back and did ${npcState.DMG}`)
    }
} 

const attack = async (attackerId, attackedId) => {
    gameState = await findPlayerById(attackerId);
    // console.log('gameState is: ', gameState)
    npcState = await findNPCById(attackedId);
    console.log(gameState.name + ' attacks ' + npcState.name)
    await updateNPCById(npcState._id, {HP: npcState.HP - gameState.DMG})
    gameState = await findPlayerById(attackerId)
    npcState = await findNPCById(attackedId);
    // console.log('golemState is: ', golemState)
    // if (golemState.HP <= 0){
    //     message = (`You have defeated the golem! Go to "http://localhost:5000/Golem/reward" to claim your reward!`)
    //     return ({message: message, golemState: golemState})
    // } else {
    //     message = (`You have attacked the golem and did ${gameState.DMG} damage, it has ${golemState.HP} HP left! Visit the endpoint again to attack the Golem again!`)
    //     return ({message: message, golemState: golemState})
    // }
}

const npcAttack = async(gameStateId, npcStateId) => {
    gameState = await findPlayerById(gameStateId);
    // console.log('npcAttack gameState is: ', gameState)
    dragonState = await findNPCById(npcStateId);
    await updatePersonById(gameState._id, {HP: gameState.HP - dragonState.DMG})
    gameState = await findPlayerById(gameStateId);
    if (gameState.HP <= 0){
        message = (`Oh dear you have died...`)
        return ({message: message, gameState: gameState})
    } else {
        message = (`The ${dragonState.name} has attacked you and did ${dragonState.DMG} damage, you have ${gameState.HP} HP left!`)
        return ({message: message, gameState: gameState})
    }
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
        HP: 200,
        DMG: 9
    });
    let newGameId = newGameState.insertedId;
    let game = await findPlayerById(newGameId);
    gameState = game;
    // console.log('gameState is: ', gameState)
    return gameState
}

// Create Golem
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

// Create Dragon
const createDragon = async (name) => {
    let newNPCState = await createNPC({
        name: name,
        HP: 100,
        DMG: 15
    });
    let newNPCId = newNPCState.insertedId;
    let dragon = await findNPCById(newNPCId);
    dragonState = dragon;
    return dragonState
}

// Create Equipment
const createEquipment = async (name) => {
    let newItemState = await createItem({
        name: name,
        HP: 10,
        DMG: 10
    });
    let newItemId = newItemState.insertedId;
    let item = await findItemById(newItemId);
    itemState = item;
    return itemState
}

module.exports = {chooseClass, randomDice, loadGameState, createGameState, createGolem, createEquipment, createDragon, attack, npcAttack, handleCombat}
