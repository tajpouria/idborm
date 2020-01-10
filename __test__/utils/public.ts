// RANDOM GENERATORS
/** 
 Generate random number between two numbers

 @param {number} min 
 @param {number} max 
 @return {number}
*/
export const randomIntFromInterval = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 Generate random string

 @returns {string}
*/
export const randomString = (): string => Math.random().toString();

/** 
 Repeat an action in amount that specified or a random value between specified sequence

 @param {() => any} action
 @param {number | [number, number]} repeatCount - exact number or subsequent between two number 
*/
export const repeater = (
  action: (args?: any) => any,
  repeatCount: number | [number, number],
  args: any[] = [],
): any[] => {
  const _repeatCount =
    typeof repeatCount === "number" ? repeatCount : randomIntFromInterval(repeatCount[0], repeatCount[1]);

  const results = [];
  for (let index = 0; index < _repeatCount; index += 1) {
    results.push(action(...args));
  }

  return results;
};
