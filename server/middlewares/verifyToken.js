const jwt = require("jsonwebtoken")

exports.verifyToken =  function verifyToken(ctx, next) {
    const token = ctx.request.body.token || ctx.request.query.token || ctx.request.headers["x-access-token"]

    if (token) {
        jwt.verify(token, ctx.secrets.jwt.secret, (err, decoded) => {
            if (err) {
                return ctx.throw(403, "Failed to authenticate token.")
            }
            // if everything is good, save to request for use in other routes
            ctx.request.decoded = decoded
            return next()
        })

    }
        // if there is no token
        // return an error
    return ctx.throw(403, "No token provided.")

}