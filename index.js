/*
    acceleration - applies when target is lost
    velocity - resets when target is lost
*/

class Melee {
    constructor(client, velocity, acceleration) {
        this.client = client
        this.velocity = velocity
        this.acceleration = acceleration

        // keep track of angular velocity/acceleration
        this.#VELOCITY = 0
        this.#ACCELERATION = 0
    }

    swing(entity) {
        // get angle where player is facing
        let x0, y0
        x0 = Math.cos(this.client.entity.pitch)
        y0 = Math.sin(this.client.entity.pitch)

        // get angle where player needs to face
        let x1, y1
        let distance = entity.position.distanceTo(this.client.entity.position)
        x1 = Math.sqrt(
            (entity.position.x - this.client.entity.position.x) ** 2,
            (entity.position.z - this.client.entity.position.z) ** 2
        ) / distance
        y1 = (entity.position.y - this.client.entity.position.y) / distance

        // find their difference
        let x2, y2
        x2 = x1 - x0
        y2 = y1 - y0
        /*
            1. get angle where player is looking
            2. get angle where player needs to face
            3. find difference between the two
            4. see if current velocity covers the angle difference
        */

    }
}