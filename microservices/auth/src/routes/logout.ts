import express from 'express';

const router = express.Router();

router.get('/api/users/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Successfully logged out' });
  });
});

export { router as logoutRouter };
