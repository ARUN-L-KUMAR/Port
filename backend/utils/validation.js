const validateStatusCheck = (data) => {
  const errors = [];
  
  if (!data.client_name || typeof data.client_name !== 'string') {
    errors.push('client_name is required and must be a string');
  }
  
  if (data.client_name && data.client_name.length > 100) {
    errors.push('client_name must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateStatusCheck
};