import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  '/api/users/google-auth',
  passport.authenticate('google', {
      scope:
        ['email', 'profile']
    }
  ));

router.get(
  '/api/users/google-auth/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/google/failure'
  })
)
export {router as googleAuthRouter};