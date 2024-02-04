const ERROR_STATUS = {
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  BandwidthLimitExceeded: 509,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
}

class HttpError extends Error {
  constructor(status, message, data) {
    super(message)
    this.status = status
    this.data = data
    this.code = this.getKeyByValueAndFormat(status) ?? 'Unhandled Error'
  }

  getKeyByValueAndFormat(value) {
    const key = Object.keys(ERROR_STATUS).find((k) => ERROR_STATUS[k] === value)
    return key ? this.formatKey(key) : undefined
  }

  formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').trim()
  }

  static create(status, message, data) {
    return new HttpError(status, message, data)
  }

  static createMethods() {
    const methods = {}
    Object.entries(ERROR_STATUS).forEach(([errorType, status]) => {
      const createError = (message, data) => this.create(status, message, data)
      methods[errorType] = createError
      methods[status] = createError
    })
    return methods
  }
}

module.exports = HttpError.createMethods()
