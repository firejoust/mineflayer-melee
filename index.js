class Melee {
    constructor(client, acceleration, chance) {
        this.client = client
        this.acceleration = acceleration
        this.chance = chance

        // keep track of angular velocity
        this.#VELOCITY = new Float64Array(2)
    }

    swing(entity, hand) {
        // get angle where player is facing
        let initial = new Float64Array(2)
        initial[1]  = this.client.entity.pitch + Math.PI
        initial[0]  = this.client.entity.yaw + Math.PI

        // get angle where player needs to face
        let target = new Float64Array(2)
        target[1]  = Math.asin(entity.position.y - this.client.entity.position.y)
        target[0]  = Math.atan2(
            (entity.position.z - this.client.entity.position.z),
            (entity.position.x - this.client.entity.position.x)
        )

        // get angle difference between the two
        let difference = new Float64Array(2)
        difference[1]  = target[1] - initial[1]
        difference[0]  = target[0] - initial[0]

        // update the angular velocity
        this.#VELOCITY[1] += this.acceleration * Math.sign(difference[1])
        this.#VELOCITY[0] += this.acceleration * Math.sign(difference[0])

        // initialise the final angle
        let final = new Float64Array(2)
        final[1]  = initial[1] + this.#VELOCITY[1]
        final[0]  = initial[0] + this.#VELOCITY[0]

        // velocity can cover the distance
        // actually this won't work. (velocity has a direction, only if it covers distance in a certain direction will it work)
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
            final[0] - Math.PI,
            final[1] - Math.PI
        )

        // simulate an attack
        if (Math.random() < this.chance) {
            this.client.swingArm(hand)

            // if raycast clear; send attack packet
        }
    }
}