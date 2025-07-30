// Simple room storage untuk development
const fs = require('fs').promises;
const path = require('path');

const ROOMS_FILE = path.join(__dirname, '../rooms.json');

class RoomDB {
  static async readRooms() {
    try {
      const data = await fs.readFile(ROOMS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist, return empty array
      return [];
    }
  }

  static async writeRooms(rooms) {
    await fs.writeFile(ROOMS_FILE, JSON.stringify(rooms, null, 2));
  }

  static async getAllRooms() {
    return await this.readRooms();
  }

  static async createRoom(roomData, userId) {
    const rooms = await this.readRooms();
    
    const newRoom = {
      id: Date.now().toString(),
      name: roomData.name,
      description: roomData.description || '',
      createdBy: userId,
      createdById: userId,
      createdAt: new Date().toISOString(),
      participants: [userId],
      isPrivate: roomData.isPrivate || false,
      password: roomData.password || null
    };

    rooms.push(newRoom);
    await this.writeRooms(rooms);
    
    return newRoom;
  }

  static async getRoomById(roomId) {
    const rooms = await this.readRooms();
    return rooms.find(room => room.id === roomId);
  }

  static async joinRoom(roomId, userId, password = null) {
    const rooms = await this.readRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    const room = rooms[roomIndex];
    
    // Check password for private rooms
    if (room.isPrivate && room.password !== password) {
      throw new Error('Invalid password');
    }

    // Add user to participants if not already in
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      rooms[roomIndex] = room;
      await this.writeRooms(rooms);
    }

    return room;
  }

  static async leaveRoom(roomId, userId) {
    const rooms = await this.readRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    const room = rooms[roomIndex];
    room.participants = room.participants.filter(id => id !== userId);
    
    // If room is empty, delete it
    if (room.participants.length === 0) {
      rooms.splice(roomIndex, 1);
    } else {
      rooms[roomIndex] = room;
    }
    
    await this.writeRooms(rooms);
    return true;
  }

  static async getUserRooms(userId) {
    const rooms = await this.readRooms();
    return rooms.filter(room => room.participants.includes(userId));
  }

  static async deleteRoom(roomId) {
    const rooms = await this.readRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    rooms.splice(roomIndex, 1);
    await this.writeRooms(rooms);
    return true;
  }
}

module.exports = RoomDB;
