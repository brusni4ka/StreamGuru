const user = require("../services/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.auth = async function auth(ctx, next) {
    const { password } = ctx.request.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await user.createUser(Object.assign({}, ctx.request.body, { password: hashedPassword }))

    if (!newUser) {
        ctx.throw(403, "User already exist")
    } else {
        ctx.status = 200
        ctx.body = JSON.stringify(newUser)
    }
    next()
}

exports.login = async function login(ctx, next) {
    const { password } = ctx.request.body
    const currentUser = await user.findUser(ctx.request.body)
    const isExactPassword = await bcrypt.compare(password, currentUser.password)


    if (!isExactPassword) {
        ctx.throw(401, "Wrong credentials")
    } else {
        const payload = {
            user: currentUser.login
        }
        console.log("secret", ctx.secrets.jwt.secret)
        const token = jwt.sign(payload, ctx.secrets.jwt.secret)

        // return the information including token as JSON
        ctx.status = 200
        ctx.body = token
    }
    next()
}

exports.logout = async function logout(ctx, next) {
    next()
}