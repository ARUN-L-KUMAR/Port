const StatusCheck = require('../api/models/StatusCheck');

describe('StatusCheck Model', () => {
  test('should create a new status check with default values', () => {
    const statusCheck = new StatusCheck({ client_name: 'test-client' });
    
    expect(statusCheck.id).toBeDefined();
    expect(statusCheck.client_name).toBe('test-client');
    expect(statusCheck.timestamp).toBeInstanceOf(Date);
  });

  test('should create a status check with provided values', () => {
    const testData = {
      id: 'test-id',
      client_name: 'test-client',
      timestamp: new Date('2023-01-01')
    };
    
    const statusCheck = new StatusCheck(testData);
    
    expect(statusCheck.id).toBe('test-id');
    expect(statusCheck.client_name).toBe('test-client');
    expect(statusCheck.timestamp).toEqual(new Date('2023-01-01'));
  });

  test('should convert to object correctly', () => {
    const testData = {
      id: 'test-id',
      client_name: 'test-client',
      timestamp: new Date('2023-01-01')
    };
    
    const statusCheck = new StatusCheck(testData);
    const obj = statusCheck.toObject();
    
    expect(obj).toEqual(testData);
  });
});