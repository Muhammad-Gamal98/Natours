const express = require('express');
const viewsController = require('../controller/viewController');
const authController = require('../controller/authController');


const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect , viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
