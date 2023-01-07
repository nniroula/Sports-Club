/** ExpressError extends normal JavaScript error, which helps to add a status when an instance is created.
 *  The error-handling middleware will return this.
 */

 class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
    }
  }
  
  /** 404 NOT FOUND error. */
  
  class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
  }
  
  
  /** 400 BAD REQUEST error. */
  
  class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }
  
  /** 403 BAD REQUEST error. */
  
  class ForbiddenError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 403);
    }
  }

    /** 409 CONFLICT error. */
  
  class ConflictError extends ExpressError {
    constructor(message = "Conflict") {
      super(message, 409);
    }
  }
  
  module.exports = {
    ExpressError,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    ConflictError
  };