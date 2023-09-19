const { Router } = require('express');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadfile');

const router = Router();

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

router.get('/current', authMiddleware, authController.current);

router.put('/password', authMiddleware, authController.password);

router.get('/logout', authMiddleware, authController.logout);

// router.post('/avatar', authMiddleware, uploadCloud.single('image'), hhhhh);
router.patch('/avatar', authMiddleware, upload.single('avatar'), authController.avatar);

module.exports = router;
