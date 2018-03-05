import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {auth} from './controllers';

const PORT = process.PORT || 8080;
const app = new Koa();
const router = new Router();


router.post('/auth', auth.login);

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Starting server on ${PORT}`)
});

