const express = require('express');
const userAlimentController = require('../controllers/userFoodItem-controller');
const router = express.Router();

router.get('/:uid/FoodItems', userAlimentController.getUserFoodItems);
router.post('/:uid/FoodItems', userAlimentController.createUserFoodItems);
router.get('/:uid/FoodItems/:aid', userAlimentController.getUserFoodItem);
router.put('/:uid/FoodItems/:aid', userAlimentController.updateUserFoodItems);
router.delete('/:uid/FoodItems/:aid', userAlimentController.deleteUserFoodItems);

module.exports = router;