const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const authenticate = require('../middleware/authenticate');

// All room routes require authentication
router.use(authenticate);

// Get all available rooms
router.get('/', RoomController.getAllRooms);

// Get user's joined rooms
router.get('/my-rooms', RoomController.getUserRooms);

// Create new room
router.post('/', RoomController.createRoom);

// Get room details
router.get('/:roomId', RoomController.getRoomDetails);

// Join room
router.post('/:roomId/join', RoomController.joinRoom);

// Leave room
router.post('/:roomId/leave', RoomController.leaveRoom);

// Delete room
router.delete('/:roomId', RoomController.deleteRoom);

module.exports = router;
