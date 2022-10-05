const Raycast = require("./utils/raycast")
const Angle = require("./utils/angle")

class Melee {
    #VELOCITY

    constructor(client, velocity, acceleration, chance, range) {
        this.client = client
        this.velocity = velocity
        this.acceleration = acceleration
        this.chance = chance
        this.range = range

        // keep track of angular velocity
        this.#VELOCITY = new Float64Array(2)
    }

    swing(entity, hand) {
        // get angle where player is facing
        let initial = new Float64Array(2)
        initial[1]  = this.client.entity.pitch
        initial[0]  = this.client.entity.yaw

        // get angle where player needs to face
        let distance = this.client.entity.position.distanceTo(entity.position)
        let target = new Float64Array(2)
        target[1]  = Math.asin(
            (entity.position.y - this.client.entity.position.y) / distance
        )
        target[0]  = Math.atan2(
            (this.client.entity.position.x - entity.position.x) / distance,
            (this.client.entity.position.z - entity.position.z) / distance
        )

        // get angle difference between the two
        let difference = new Float64Array(2)
        difference[1]  = Angle.difference(initial[1], target[1])
        difference[0]  = Angle.difference(initial[0], target[0])

        // update the angular velocity
        this.#VELOCITY[1] += this.acceleration * Math.sign(difference[1])
        this.#VELOCITY[0] += this.acceleration * Math.sign(difference[0])

        // limit maximum angular velocity
        this.#VELOCITY[1] = Math.abs(this.#VELOCITY[1]) > this.velocity
        ? this.velocity * Math.sign(this.#VELOCITY[1])
        : this.#VELOCITY[1]

        this.#VELOCITY[0] = Math.abs(this.#VELOCITY[0]) > this.velocity
        ? this.velocity * Math.sign(this.#VELOCITY[0])
        : this.#VELOCITY[0]

        // initialise the final angle
        let final = new Float64Array(2)
        final[1]  = initial[1] + this.#VELOCITY[1]
        final[0]  = initial[0] + this.#VELOCITY[0]

        // velocity can cover the distance
        if (Math.abs(this.#VELOCITY[1]) > Math.abs(difference[1]))
        {
            final[1] = target[1]
            this.#VELOCITY[1] = 0
        }

        if (Math.abs(this.#VELOCITY[0]) > Math.abs(difference[0]))
        {
            final[0] = target[0]
            this.#VELOCITY[0] = 0
        }

        this.client.look(
            final[0],
            final[1]
        )

        // simulate an attack
        if (Math.random() < this.chance) {
            this.client.swingArm(hand)

            // if raycast clear; send attack packet
            if (Raycast.canAttack(final[0], final[1], this.range, this.client, entity))
            {
                this.client.attack(entity, false)
            }
        }
    }
}

function getPlugin(options) {
    let config = options || {}
    return client => {
        client.melee = new Melee(
            client,
            config.velocity || 0.4,
            config.acceleration || 0.1,
            config.chance || 0.35,
            config.range || 4
        )
    }
}

module.exports = {
    getPlugin
}