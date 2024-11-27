const debug = require('debug')('app:audit');

class Logger {
  static logOperation(operation, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      ...data
    };
    
    debug(JSON.stringify(logEntry));
    
    // In a production environment, you might want to:
    // - Write to a database
    // - Send to a logging service
    // - Write to a file
  }

  static logCreate(entityType, entityId, data) {
    this.logOperation('CREATE', {
      entityType,
      entityId,
      data
    });
  }

  static logUpdate(entityType, entityId, changes) {
    this.logOperation('UPDATE', {
      entityType,
      entityId,
      changes
    });
  }

  static logDelete(entityType, entityId) {
    this.logOperation('DELETE', {
      entityType,
      entityId
    });
  }
}

module.exports = Logger;