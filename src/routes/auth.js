const { Router } = require('express');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadfile');

const router = Router();

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

router.get('/current', authMiddleware, authController.current);

router.post('/logout', authMiddleware, authController.logout);

router.patch('/avatar', authMiddleware, upload.single('avatar'), authController.avatar);

router.patch('/info', authMiddleware, authController.updateUser);

module.exports = router;
