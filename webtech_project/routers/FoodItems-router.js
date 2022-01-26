const express = require('express');
const FoodItemsController = require('../controllers/FoodItems-controller');
const router = express.Router();

router.get('/', FoodItemsController.getFoodItems);
router.post('/', FoodItemsController.createFoodItems);
router.get('/:aid', FoodItemsController.getFoodItem);
router.put('/:aid', FoodItemsController.updateFoodItems);
router.delete('/:aid', FoodItemsController.deleteFoodItems);

module.exports = router;