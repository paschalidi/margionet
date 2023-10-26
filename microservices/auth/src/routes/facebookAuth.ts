import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  '/api/users/facebook-auth',
  passport.authenticate('facebook', {
      scope:
        ['email']
    }
  ));

router.get(
  '/api/users/facebook-auth/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/facebook/failure'
  })
)
export {router as facebookAuthRouter};