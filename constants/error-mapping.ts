export const LOGIN_ERRORS = {
  MISSING_EMAIL_PWD: "Email and password are required.",
  USER_NOT_FOUND: "User not found.",
  INVALID_CREDENTIALS: "Invalid credentials.",
};

export const CREATE_USER_ERRORS = {
  MISSING_FIELDS: "First name, email, and password are required.",
  USER_EXISTS: "User with this email already exists.",
};

export const GET_USER_ERRORS = {
  MISSING_PARAMS: "Missing userId or email.",
  USER_NOT_FOUND: "User not found.",
};

export const PLACE_BET_ERRORS = {
  USER_NOT_FOUND: "User not found.",
  MISSING_PARAMS: "Missing userId or betType.",
};

export const GET_USER_SCORE = {
  MISSING_PARAMS: "Missing userId.",
  USER_NOT_FOUND: "User not found.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const RESOLVE_BET = {
  MISSING_PARAMS: "Missing userId.",
  NO_PENDING_BET: "No pending bet found.",
};
