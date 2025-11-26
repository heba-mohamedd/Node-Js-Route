var createCounter = function (init) {
  let temp = init;
  let object = {
    increment: () => ++init,
    reset: () => (init = temp),
    decrement: () => --init,
  };
  return object;
};

const counter = createCounter(5);
console.log(`bonus task =>>>>>>>>>>>>> 
   counter.increment() =>  ${counter.increment()} 
   counter.reset() => ${counter.reset()} 
   counter.decrement() => ${counter.decrement()}
    `);
// counter.increment(); // 6
// counter.reset(); // 5
// counter.decrement(); // 4
