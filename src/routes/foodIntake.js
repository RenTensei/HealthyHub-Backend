const { Router } = require('express');

const foodIntakeController = require('../controllers/foodIntakeController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// router.get('/food-intake', authMiddleware, foodIntakeController.getAll);

router.post('/food-intake', authMiddleware, foodIntakeController.createMeal);
router.get('/food-intake', authMiddleware, foodIntakeController.getDiaryFood);
router.put('/food-intake/:id', authMiddleware, foodIntakeController.putDiaryFood);
router.get('/recomended-food', authMiddleware, foodIntakeController.getRecommendedFood);

module.exports = router;
