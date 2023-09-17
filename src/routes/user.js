const { Router } = require('express');

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/statistics', authMiddleware, userController.statistics);

router.patch('/info', authMiddleware, userController.updateUser);

router.put('/goal', authMiddleware, userController.updateUserGoal);

router.put('/weight', authMiddleware, userController.updateUserWeight);

module.exports = router;
