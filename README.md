This is a CYO Adventure program.

Things to add:
-changing HP during combat
-more endpoints (treasure chest, puzzle, etc...)
-level up and character stats that can increase with level ups
-character items 
-front end?

Currently working on:
-game stops when life count hits 0
-Work on Golem/combat
-add more endpoints (puzzle)
-reorganize file into routes and models

Bugs to fix:
-Edge case: when user and npc hits 0 it will display both npc message and user message -> only want to display 1
possible solution: merge attack and npcAttack into 1 function and then move if statements in. 
1. share userHP and npcHP in 1 function
2. deals with async functions, don't know whether the userHP or npcHP is returned first

Struggles:
-didn't know that you had to restart MongoDB Compass to see new collections that were created. Wasted 1hr trying to figure out what was wrong with my code

Quick links:

/ - curl http://localhost:5000/
/startGame - curl http://localhost:5000/startGame?name=Derick
/loadGame - curl http://localhost:5000/loadGame
/chooseClass - curl http://localhost:5000/chooseClass?role=Warrior
/Golem - curl http://localhost:5000/Golem
/Golem/attack - curl http://localhost:5000/Golem/attack
/Golem/reward - curl http://localhost:5000/Golem/reward
/TreasureChest - curl http://localhost:5000/TreasureChest
/Dragon/combat - curl http://localhost:5000/Dragon/combat
/Dragon/reward - curl http://localhost:5000/Dragon/reward

./curlrequests.sh
------------------
startGame
chooseClass
Golem/reward
TreasureChest