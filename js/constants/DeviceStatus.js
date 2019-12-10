import helpers from "./helpers";

const deviceStatusMap = {
  CREATED: "CREATED",
  REGISTERED: "REGISTERED",
  AUTHORIZING: "AUTHORIZING",
  AUTHORIZED: "AUTHORIZED",
  REVOKING: "REVOKING",
  RECOVERING: "RECOVERING",
  REVOKED: "REVOKED"
};

helpers.addLowerCaseConstants( deviceStatusMap );

export default deviceStatusMap;