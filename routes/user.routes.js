const express = require('express');
const router = express.Router();

const email = require('../middlewares/email');
const password = require('../middlewares/password');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');

router.post('/signup', email, password, authCtrl.signup);
router.post('/login', authCtrl.login);

router.get('/', auth, userCtrl.getAllUsers);
router.get('/me', auth, userCtrl.getUserInfo);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id/picture', auth, multer, userCtrl.updateUserPic);
router.put('/:id', auth, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;
