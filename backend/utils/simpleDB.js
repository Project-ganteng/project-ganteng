// Simple file-based storage untuk development
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');

class SimpleDB {
  static async readUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist, return empty array
      return [];
    }
  }

  static async writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  static async findUserByEmail(email) {
    const users = await this.readUsers();
    return users.find(user => user.email === email);
  }

  static async createUser(userData) {
    const users = await this.readUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    
    const newUser = {
      id: users.length + 1,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await this.writeUsers(users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async validateUser(email, password) {
    const users = await this.readUsers();
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return null;
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findUserById(id) {
    const users = await this.readUsers();
    const user = users.find(user => user.id === parseInt(id));
    
    if (!user) {
      return null;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = SimpleDB;
