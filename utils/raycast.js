const Vec3 = require("vec3")
const Line3 = require("line3")
const Iterator = require("./iterator")

function canAttack(yaw, pitch, client, target) {
    let radius = client.entity.position.distanceTo(target.position)

    // initialise the raycast
    let a, b
    a = client.entity.position.offset(0, client.entity,height, 0)
    b = a.offset(
        Math.cos(yaw)   * radius,
        Math.sin(pitch) * radius,
        Math.sin(yaw)   * radius
    )

    let ray = Line3.fromVec3(a, b)

    // initialise the hitbox
    let ha, hb
    ha = target.position.minus(
        target.width / 2,
        0,
        target.width / 2
    )
    hb = ha.offset(
        target.width,
        target.height,
        target.width
    )

    let ih, ib

    // check if the ray intercepts with hitbox
    ih = ray.rectIntercept([
        [ha.x, ha.y, ha.z],
        [hb.x, hb.y, hb.z]
    ])

    // hitbox isn't visible
    if (!ih) return null

    // check if the ray intercepts with blocks
    Iterator.iterBlocks(ray, (x, y, z) => {

    })

    // no block obstruction; hitbox can be attacked
    if (!ib) return ih

    return null
}