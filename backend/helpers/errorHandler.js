import { DatabaseError, ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export const handleSequelizeError = (error) => {
  // Handle validation errors
  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      message: error.errors[0]?.message || 'Validation error occurred'
    };
  }

  // Handle unique constraint errors
  if (error instanceof UniqueConstraintError) {
    const field = error.errors[0]?.path;
    const fieldMessages = {
      email: 'Email is already in use',
      username: 'Username is already taken',
      name: 'Name must be unique'
    };
    
    return {
      statusCode: 409,
      message: fieldMessages[field] || 'Duplicate value not allowed'
    };
  }

  // Handle foreign key constraint errors
  if (error instanceof ForeignKeyConstraintError) {
    return {
      statusCode: 400,
      message: 'Referenced record does not exist'
    };
  }

  // Handle general database errors
  if (error instanceof DatabaseError) {
    return {
      statusCode: 500,
      message: 'Database operation failed'
    };
  }

  // Handle connection errors
  if (error.name === 'SequelizeConnectionError') {
    return {
      statusCode: 503,
      message: 'Database connection failed'
    };
  }

  // Default error
  return {
    statusCode: 500,
    message: error.message || 'Internal server error'
  };
};

// MongoDB error to PostgreSQL error mapping
export const mapMongoErrorToSequelize = (mongoError) => {
  // Map MongoDB CastError to ValidationError
  if (mongoError.name === 'CastError') {
    return {
      statusCode: 400,
      message: `Invalid ${mongoError.path}: ${mongoError.value}`
    };
  }

  // Map MongoDB duplicate key error
  if (mongoError.code === 11000) {
    const field = Object.keys(mongoError.keyPattern)[0];
    return {
      statusCode: 409,
      message: `${field} already exists`
    };
  }

  // Map MongoDB validation error
  if (mongoError.name === 'ValidationError') {
    const firstError = Object.values(mongoError.errors)[0];
    return {
      statusCode: 400,
      message: firstError.message
    };
  }

  return {
    statusCode: 500,
    message: mongoError.message || 'Database error occurred'
  };
};