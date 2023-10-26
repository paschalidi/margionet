import express from "express";
import passport from "passport";
import { magicLoginStrategy } from "../utils/passportOauthStrategies";

const router = express.Router();

router.post("/api/users/magiclogin-auth", magicLoginStrategy.send);

// The standard passport callback setup
router.get(
  '/api/users/magiclogin-auth/callback',
  passport.authenticate("magiclogin", {
    successRedirect: '/',
    failureRedirect: '/auth/magiclogin/failure'
  })
);

export { router as magicLinkAuthRouter };