import helpers from "./helpers";

const userStatusMap = {
  CREATED: "CREATED",
  ACTIVATING: "ACTIVATING",
  ACTIVATED: "ACTIVATED",
  UNKNOWN: "UNKNOWN"
};

helpers.addLowerCaseConstants( userStatusMap );

export default userStatusMap;