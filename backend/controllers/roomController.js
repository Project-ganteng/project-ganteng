const RoomDB = require('../utils/roomDB');
const SimpleDB = require('../utils/simpleDB');

class RoomController {
  static async getAllRooms(req, res) {
    try {
      const rooms = await RoomDB.getAllRooms();
      
      // Get creator info for each room
      const safeRooms = await Promise.all(rooms.map(async room => {
        let creatorEmail = 'Unknown';
        try {
          const creator = await SimpleDB.findUserById(room.createdBy);
          if (creator) {
            creatorEmail = creator.email.split('@')[0]; // Get username part of email
          }
        } catch (error) {
          console.log('Error getting creator info:', error);
        }
        
        return {
          ...room,
          password: undefined,
          hasPassword: !!room.password,
          creatorName: creatorEmail
        };
      }));

      res.json({
        success: true,
        rooms: safeRooms
      });
    } catch (error) {
      console.error('Get rooms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get rooms',
        error: error.message
      });
    }
  }

  static async createRoom(req, res) {
    try {
      const { name, description, isPrivate, password } = req.body;
      const userId = req.user.id;

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Room name is required'
        });
      }

      if (isPrivate && (!password || password.length < 3)) {
        return res.status(400).json({
          success: false,
          message: 'Private rooms require a password (min 3 characters)'
        });
      }

      const roomData = {
        name: name.trim(),
        description: description?.trim() || '',
        isPrivate: !!isPrivate,
        password: isPrivate ? password : null
      };

      const room = await RoomDB.createRoom(roomData, userId);

      // Get creator info
      const creator = await SimpleDB.findUserById(userId);

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        room: {
          ...room,
          password: undefined,
          hasPassword: !!room.password,
          createdByName: creator.email
        }
      });
    } catch (error) {
      console.error('Create room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create room',
        error: error.message
      });
    }
  }

  static async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { password } = req.body || {}; // Handle case when req.body is undefined
      const userId = req.user.id;

      const room = await RoomDB.joinRoom(roomId, userId, password);

      res.json({
        success: true,
        message: 'Joined room successfully',
        room: {
          ...room,
          password: undefined,
          hasPassword: !!room.password
        }
      });
    } catch (error) {
      console.error('Join room error:', error);
      if (error.message === 'Room not found') {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }
      if (error.message === 'Invalid password') {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to join room',
        error: error.message
      });
    }
  }

  static async leaveRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      await RoomDB.leaveRoom(roomId, userId);

      res.json({
        success: true,
        message: 'Left room successfully'
      });
    } catch (error) {
      console.error('Leave room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to leave room',
        error: error.message
      });
    }
  }

  static async getUserRooms(req, res) {
    try {
      const userId = req.user.id;
      const rooms = await RoomDB.getUserRooms(userId);

      const safeRooms = rooms.map(room => ({
        ...room,
        password: undefined,
        hasPassword: !!room.password
      }));

      res.json({
        success: true,
        rooms: safeRooms
      });
    } catch (error) {
      console.error('Get user rooms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user rooms',
        error: error.message
      });
    }
  }

  static async getRoomDetails(req, res) {
    try {
      const { roomId } = req.params;
      const room = await RoomDB.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      res.json({
        success: true,
        room: {
          ...room,
          password: undefined,
          hasPassword: !!room.password
        }
      });
    } catch (error) {
      console.error('Get room details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get room details',
        error: error.message
      });
    }
  }

  static async deleteRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      const room = await RoomDB.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      // Only the room creator can delete the room
      if (room.createdById !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Only the room creator can delete this room'
        });
      }

      await RoomDB.deleteRoom(roomId);

      res.json({
        success: true,
        message: 'Room deleted successfully'
      });
    } catch (error) {
      console.error('Delete room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete room',
        error: error.message
      });
    }
  }
}

module.exports = RoomController;
