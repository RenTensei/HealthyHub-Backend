const { Router } = require('express');

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadCloud = require('../middlewares/uploadMiddleware');

const router = Router();

router.get('/statistics', authMiddleware, userController.statistics);

router.patch('/info', authMiddleware, uploadCloud.single('avatarURL'), userController.updateUser);

router.put('/goal', authMiddleware, userController.updateUserGoal);

router.put('/weight', authMiddleware, userController.updateUserWeight);

module.exports = router;
