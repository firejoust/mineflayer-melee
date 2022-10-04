const Vec3 = require("vec3")
const Line3 = require("line3")
const Iterator = require("./iterator")

function canAttack(yaw, pitch, range, client, entity) {
    // initialise the raycast
    let a, b
    a = client.entity.position.offset(0, client.entity.height, 0)
    b = a.offset(
      - Math.sin(yaw)   * range,
        Math.sin(pitch) * range,
      - Math.cos(yaw)   * range
    )

    let ray = Line3.fromVec3(a, b)

    // initialise the hitbox
    let ha, hb
    ha = entity.position.offset(
        - entity.width / 2,
        0,
        - entity.width / 2
    )
    hb = ha.offset(
        entity.width,
        entity.height,
        entity.width
    )

    let ih, ib

    // check if the ray intercepts with hitbox
    ih = ray.rectIntercept([
        [ha.x, ha.y, ha.z],
        [hb.x, hb.y, hb.z]
    ])

    // client isn't facing the hitbox
    if (!ih) return null

    // check if the ray intercepts with blocks
    Iterator.iterBlocks(ray, (x, y, z) => {
        let pos = new Vec3(x, y, z)
        let block = client.blockAt(pos)

        if (block && block.boundingBox === "block") {
            let rect = [
                [x, y, z],
                [x + 1, y + 1, z + 1]
            ]

            let entrance = ray.rectIntercept(rect, ray.rectFace(false))
            let exit     = ray.rectIntercept(rect, ray.rectFace(true))

            // use at least one
            ib = entrance ?? exit
            return Boolean(ib)
        }
    })

    // no block obstruction; hitbox is visible
    if (!ib) return ih

    return null
}

module.exports = {
    canAttack
}