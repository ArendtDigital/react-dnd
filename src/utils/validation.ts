import { DragDropConfig, ValidationError } from '../types';

// Validation rules and error messages
const VALIDATION_RULES = {
  draggableId: {
    required: true,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'draggableId must be a non-empty string containing only letters, numbers, underscores, and hyphens',
  },
  index: {
    required: true,
    min: 0,
    message: 'index must be a non-negative number',
  },
  type: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'type must contain only letters, numbers, underscores, and hyphens',
  },
} as const;

// Validation functions
export const validateDragDropConfig = (config: DragDropConfig): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate draggableId
  if (!config.draggableId) {
    errors.push({
      field: 'draggableId',
      message: VALIDATION_RULES.draggableId.message,
      code: 'REQUIRED_FIELD',
    });
  } else if (!VALIDATION_RULES.draggableId.pattern.test(config.draggableId)) {
    errors.push({
      field: 'draggableId',
      message: VALIDATION_RULES.draggableId.message,
      code: 'INVALID_FORMAT',
    });
  }

  // Validate index
  if (typeof config.index !== 'number' || config.index < 0) {
    errors.push({
      field: 'index',
      message: VALIDATION_RULES.index.message,
      code: 'INVALID_VALUE',
    });
  }

  // Validate type (optional)
  if (config.type && !VALIDATION_RULES.type.pattern.test(config.type)) {
    errors.push({
      field: 'type',
      message: VALIDATION_RULES.type.message,
      code: 'INVALID_FORMAT',
    });
  }

  return errors;
};

// Validate droppable configuration
export const validateDroppableConfig = (droppableId: string, config: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!droppableId) {
    errors.push({
      field: 'droppableId',
      message: 'droppableId is required',
      code: 'REQUIRED_FIELD',
    });
  } else if (!VALIDATION_RULES.draggableId.pattern.test(droppableId)) {
    errors.push({
      field: 'droppableId',
      message: VALIDATION_RULES.draggableId.message,
      code: 'INVALID_FORMAT',
    });
  }

  return errors;
};

// Validate drag result
export const validateDragResult = (result: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!result.draggableId) {
    errors.push({
      field: 'draggableId',
      message: 'draggableId is required in drag result',
      code: 'REQUIRED_FIELD',
    });
  }

  if (!result.source || typeof result.source.index !== 'number') {
    errors.push({
      field: 'source',
      message: 'source with valid index is required in drag result',
      code: 'INVALID_STRUCTURE',
    });
  }

  return errors;
};

// Helper to format validation errors for console
export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  return errors
    .map(error => `[${error.field}] ${error.message} (${error.code})`)
    .join('\n');
};

// Helper to throw validation errors in development
export const throwValidationErrors = (errors: ValidationError[], context: string): void => {
  if (process.env.NODE_ENV === 'development' && errors.length > 0) {
    const errorMessage = `React-DND Validation Errors in ${context}:\n${formatValidationErrors(errors)}`;
    console.error(errorMessage);
    
    // In development, throw an error to help catch issues early
    throw new Error(errorMessage);
  }
};

// Auto-validation decorator for functions
export const withValidation = <T extends any[], R>(
  validator: (...args: T) => ValidationError[],
  fn: (...args: T) => R
) => {
  return (...args: T): R => {
    const errors = validator(...args);
    throwValidationErrors(errors, fn.name);
    return fn(...args);
  };
};

// Validation middleware for context operations
export const createValidationMiddleware = () => {
  return {
    validateDraggable: (config: DragDropConfig) => {
      const errors = validateDragDropConfig(config);
      throwValidationErrors(errors, 'Draggable Registration');
      return errors.length === 0;
    },
    validateDroppable: (droppableId: string, config: any) => {
      const errors = validateDroppableConfig(droppableId, config);
      throwValidationErrors(errors, 'Droppable Registration');
      return errors.length === 0;
    },
    validateDragResult: (result: any) => {
      const errors = validateDragResult(result);
      throwValidationErrors(errors, 'Drag Result');
      return errors.length === 0;
    },
  };
}; 