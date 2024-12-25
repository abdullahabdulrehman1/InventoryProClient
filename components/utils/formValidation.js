// Validation.js
export const validateForm = (formData, validationRules) => {
  const errors = {};

  const validateField = (field, value, validations) => {
    for (let validation of validations) {
      const { method, message, args } = validation;
      if (!method(value, ...(args || []))) {
        return message;
      }
    }
    return null;
  };

  for (let rule of validationRules) {
    const { field, validations } = rule;
    const value = formData[field];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        for (let key in item) {
          const error = validateField(`${field}[${index}].${key}`, item[key], validations[key] || []);
          if (error) {
            errors[`${field}[${index}].${key}`] = error;
          }
        }
      });
    } else {
      const error = validateField(field, value, validations);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return errors;
};

// Example validation methods
export const validationMethods = {
  required: (value) => value !== undefined && value !== null && value !== "",
  maxLength: (value, length) => value.length <= length,
  isNumber: (value) => !isNaN(value),
  validateDate: (value) => /^\d{2}-\d{2}-\d{4}$/.test(value), // Example date validation
};