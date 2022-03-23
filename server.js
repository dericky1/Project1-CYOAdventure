const express = require('express');
const app = express();
const {randomDice, chooseClass, golemCombatRoll, loadGameState, newGameId, createGameState, createGolem, attack} = require('./gameFunctions')
const {updatePersonById, findPlayerById, findPlayerByName, getDb, getCollection, createPlayer, createNPC, } = require('./mongoDb');
// const mongoose = require('mongoose');

// Listen
app.listen(5000, () => {console.log('server is listening on port 3000...')})

// Database
// mongoose.connect('', {useNewParser: true})
//     .then(() => console.log('Connected to databate...'))
//     .catch(err => console.err(err));

// Routes

app.get('/', (req,res) => {
    res.send('You are camped outside of the dungeon please go to: "http://localhost:5000/startGame?name=${name}" to set your class and start your adventure! or go to http://localhost:5000/loadGame?gameId={id} to load a previous game')
});

app.get('/loadGame', async (req,res) => {
    let gameId = req.query.gameId;
    let gameState = await loadGameState(gameId);
    // console.log('gameState is: ', gameState)
    res.send(`You have loaded your previous game. Welcome back ${gameState.name}!...to continue...`)
});

app.get('/startGame', async (req, res) => {
    let name = req.query.name;
    gameState = await createGameState(name);
    //  console.log('gameState is: ', gameState);
    //  console.log('gameId is: ', gameId);
    res.send('Set your role to Warrior or Mage. Go to "http://localhost:5000/chooseClass?role=${role}" and enter a query to choose your class.')
});

app.get('/chooseClass', async (req, res) => {
    let role = req.query.role;
    let message = chooseClass(role);
    res.send(message)
});

app.get('/dungeonEntrance', (req, res) => {
    res.send('You have entered a dungeon and see a Golem! Approach the golem at "http://localhost:5000/Golem".')
});

app.get('/Golem', async (req, res) => { 
    golemState = await createGolem('Golem')
    // console.log(golemState)
    res.send('The Golem has spawned! Go to curl http://localhost:5000/Golem/combat to attack it')
    //let message = golemCombatRoll()
    //res.send(message)
});

app.get('/Golem/attack', async (req, res) => { 
    // console.log(golemState);
    attackFunction = await attack(golemState._id);
    golemState = attackFunction.golemState;
    res.send(attackFunction.message)
});

app.get('/End', (req, res) => {
    res.send('You have finished the game! Here are your achievements:')
});
