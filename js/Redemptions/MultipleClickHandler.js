export default (func, wait = 500) => {
    let tapCount = 0;
    let handler;
  
    return function() {
      if (tapCount === 0) {
        tapCount++;
        func();
      }
      // Clear the previous timeout and set a new one.
      clearTimeout(handler);
      handler = setTimeout(() => (tapCount = 0), wait);
    };
  };
  