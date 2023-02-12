<h1 align="center">Mineflayer Melee (For legacy combat)</h1>
<div align="center">
    <img src="https://img.shields.io/npm/v/mineflayer-melee?style=flat-square">
    <img src="https://img.shields.io/github/issues-raw/firejoust/mineflayer-melee?style=flat-square">
    <img src="https://img.shields.io/github/issues-pr-raw/firejoust/mineflayer-melee?style=flat-square">
</div>

### Features
- Simulate realistic player combat with minimal anticheat risk
- Built-in entity hitbox and block collision detection
- Smooth yaw/pitch rotations and no head snapping
### Installation
```bash
# using the node package manager:
npm install mineflayer-melee
```
### Usage
#### Loading the Plugin
```js
const mineflayer = require("mineflayer")
const melee = require("mineflayer-melee")

const plugin = melee.getPlugin( ... )
const bot = mineflayer.createBot( ... )

bot.loadPlugin(plugin)
```
#### Configuration
```js
/*
    On any given bot.melee.swing():
*/
const options = {
    velocity: number,     // (Units: Radians) Maximum angular velocity
    acceleration: number, // (Units: Radians) Increase in angular velocity
    chance: number,       // (0 < chance < 1) How often to actually swing
    range: number         // Maximum range to attack entities
}

const plugin = melee.getPlugin(options)
```
#### API
```js
/*
    Adjusts the player's aim, and attempts to attack an entity. Swings the sword if the attack missed.
*/
bot.melee.swing(entity, hand)

/*
    Resets the player's stored angular velocity
*/
bot.melee.reset()
```
#### Example
```js
/*
    Recommended to execute every tick for the best result
*/
bot.on("physicsTick", () => {
    const entity = bot.nearestEntity(entity => entity.type === "player")
    if (entity) bot.melee.swing(entity)
    else bot.melee.reset()
})
```
