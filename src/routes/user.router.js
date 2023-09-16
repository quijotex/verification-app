const { getAll, create, getOne, remove, update, verifyEmail } = require('../controllers/user.controller');

const express = require('express');

const userRouter = express.Router();

userRouter.route('/')
    .get(getAll)
    .post(create);

userRouter.route('/verify/:code')
    .get(verifyEmail)

userRouter.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = userRouter;