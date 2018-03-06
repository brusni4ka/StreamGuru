const Koa = require("koa")
const Router = require("koa-router")
const bodyParser = require("koa-bodyparser")
const { auth } = require("./controllers")
const { verifyToken } = require("./middlewares/verifyToken")

const PORT = process.env.PORT || 8080
const app = new Koa()
const router = new Router()


router.post("/auth", auth.auth)
router.post("/login", auth.login)
router.post("/logout", auth.logout)


app.context.secrets = require("./config/secrets")

app.use(bodyParser())
app.use(verifyToken)
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`Starting server on ${PORT}`)
})

