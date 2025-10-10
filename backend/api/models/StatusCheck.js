const { v4: uuidv4 } = require('uuid');

class StatusCheck {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.client_name = data.client_name;
    this.timestamp = data.timestamp || new Date();
  }

  // Convert to plain object for database operations
  toObject() {
    return {
      id: this.id,
      client_name: this.client_name,
      timestamp: this.timestamp
    };
  }

  // Static method to create from database object
  static fromObject(obj) {
    const statusCheck = new StatusCheck({
      id: obj.id,
      client_name: obj.client_name,
      timestamp: obj.timestamp
    });
    return statusCheck;
  }
}

module.exports = StatusCheck;