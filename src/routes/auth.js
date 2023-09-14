const { Router } = require('express');

const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

module.exports = router;
