const express = require('express');
const router = new express.Router();
const controller = require('../controllers/user.js');

const authHandler = require('../middleware/auth.js');
const errorHandler = require('../middleware/error.js');
const fileHandler = require('../middleware/file.js');

router.post('/users', controller.createUser, errorHandler);
router.get('/users/me', authHandler, controller.readUser, errorHandler);
router.patch('/users/me', authHandler, controller.updateUser, errorHandler);
router.delete('/users/me', authHandler, controller.deleteUser, errorHandler);
router.get('/users/me/avatar', authHandler, controller.getAvatar, errorHandler);
router.post('/users/me/avatar', authHandler, fileHandler.uploadImage.single('avatar'), controller.uploadAvatar, errorHandler);
router.delete('/users/me/avatar', authHandler, controller.deleteAvatar, errorHandler);

router.post('/users/login', controller.loginUser, errorHandler);
router.post('/users/logout', authHandler, controller.logoutUser, errorHandler);

module.exports = router;
