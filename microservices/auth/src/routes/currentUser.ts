import express from "express";
import {currentUser} from "@cpticketing/common-utils";

const router = express.Router();

declare module 'express-session' {
  export interface SessionData {
    passport: {
      user: string | null;
    }
  }
}

router.get("/api/users/currentuser", currentUser, (req, res) => {
  console.log("@@@@@@@session", req.session)
  res.send({currentUser: req.user || null});
})

export {router as currentUserRouter};