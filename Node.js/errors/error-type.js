let ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    httpCode: 500,
    message:
      "A big fuck up which we'll never tell you of had just happend. And now : A big fat lie....'A general error ....'",
    isShowStackTrace: true,
  },
  USER_NAME_ALREADY_EXIST: {
    id: 2,
    httpCode: 400,
    message: "User name already exist",
    isShowStackTrace: false,
  },
  EMPTY_INPUT: {
    id: 3,
    httpCode: 400,
    message: "All fields are required!",
    isShowStackTrace: false,
  },
  UNAUTHORIZED: {
    id: 4,
    httpCode: 401,
    message: "Login failed, invalid user name or password",
    isShowStackTrace: false,
  },
  PAST_DATE: {
    id: 9,
    httpCode: 400,
    message: "Date must be a future date",
    isShowStackTrace: false,
  },
  TOO_LONG_TEXT: {
    id: 10,
    httpCode: 400,
    message: "One or more of the inputs is too long.",
    isShowStackTrace: false,
  },
  INCORRECT_PASSWORD: {
    id: 10,
    httpCode: 400,
    message: "Old password is incorrect",
    isShowStackTrace: false,
  },
  INCORRECT_ISRAELI_ID: {
    id: 11,
    httpCode: 400,
    message: "Incorrect Israleli id",
    isShowStackTrace: false,
  },
  INVALID_GENDER: {
    id: 12,
    httpCode: 400,
    message: "Sex field must contain 'Male' or 'Female'",
    isShowStackTrace: false,
  },
  INVALID_DATE_FORMAT: {
    id: 12,
    httpCode: 400,
    message: "Invalid date format. The date format should be as follow: YYYY-MM-DD",
    isShowStackTrace: false,
  },
  INVALID_DATE: {
    id: 12,
    httpCode: 400,
    message: "Date field must be a passed date",
    isShowStackTrace: false,
  },
  ID_ALREADY_EXIST: {
    id: 12,
    httpCode: 400,
    message: "ID is already exist",
    isShowStackTrace: false,
  }
};

module.exports = ErrorType;
