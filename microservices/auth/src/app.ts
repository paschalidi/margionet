import express from 'express';
import 'express-async-errors';
import { json } from "body-parser";
import session from 'express-session';
import { errorHandler, NotFoundError } from "@cpticketing/common-utils";
import { currentUserRouter } from "./routes/currentUser";
import { googleAuthRouter } from "./routes/googleAuth";
import passport from "passport";
import './utils/passportOauthStrategies';
import RedisStore from "connect-redis";
import { redisClient } from "./utils/redisClient";
import { facebookAuthRouter } from "./routes/facebookAuth";
import { magicLinkAuthRouter } from "./routes/magicloginAuth";
import { logoutRouter } from "./routes/logout";

const app = express()
// this is because we have ingress nginx as a proxy.
// In other words it tells express to trust traffic
// as being secure even though it is coming from a proxy
app.set('trust proxy', 1)
app.use(json())
app.use(
  session({

    store: new RedisStore({ client: redisClient, prefix: "session:", }),
    secret: process.env.SESSION_SECRET!,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    cookie: {
      secure: false, // todo investigate
      signed: false, // todo investigate
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(googleAuthRouter)
app.use(facebookAuthRouter)
app.use(magicLinkAuthRouter)
app.use(currentUserRouter)
app.use(logoutRouter)

app.get('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


export { app }