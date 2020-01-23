import helpers from "../helpers/constantsHelper";

const userStatusMap = {
  CREATED: "CREATED",
  ACTIVATING: "ACTIVATING",
  ACTIVATED: "ACTIVATED",
  UNKNOWN: "UNKNOWN"
};

helpers.addLowerCaseConstants( userStatusMap );

export default userStatusMap;