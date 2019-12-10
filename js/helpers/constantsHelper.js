export default {
  "addLowerCaseConstants": (constants) => {
    let lowerCaseCopy = {};
    for( constantName in constants ) { if ( constants.hasOwnProperty(constantName) ) {
      const lowerCaseName = constantName.toLowerCase();
      lowerCaseCopy[ lowerCaseName ] = constants[ constantName ];
    }}
    Object.assign(constants, lowerCaseCopy);
  }
};