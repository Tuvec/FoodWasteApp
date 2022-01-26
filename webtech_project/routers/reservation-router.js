const express = require('express');
const reservationController = require('../controllers/reservation-controller');
const router = express.Router();

router.get('/:uid/reservations/', reservationController.getReservations);
router.get('/:uid/reservations/:rid', reservationController.getReservation);
router.post('/:uid/reservations/', reservationController.createReservation);
router.delete('/:uid/reservations/:rid', reservationController.deleteReservation);

module.exports = router;