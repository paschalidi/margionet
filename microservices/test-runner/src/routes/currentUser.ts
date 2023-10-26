import express from "express";
import { currentUser } from "@cpticketing/common-utils";

const router = express.Router();

router.get("/api/users/pdf", currentUser, (req, res) => {
  res.status(200);
})

export { router as currentUserRouter };