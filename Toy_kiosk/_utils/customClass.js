class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = { CustomError };

/** @forEach문에서는_예외처리를할수없다. */
