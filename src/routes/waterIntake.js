const { Router } = require('express');

const waterIntakeController = require('../controllers/waterIntakeController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/water-intake', authMiddleware, waterIntakeController.createDrink);

module.exports = router;
