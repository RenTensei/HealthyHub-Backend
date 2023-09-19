const { Router } = require('express');

const foodIntakeController = require('../controllers/foodIntakeController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/food-intake', authMiddleware, foodIntakeController.create);
router.get('/food-intake', authMiddleware, foodIntakeController.getDiaryFood);
router.get('/recomended-food', authMiddleware, foodIntakeController.getAllFood);

module.exports = router;
