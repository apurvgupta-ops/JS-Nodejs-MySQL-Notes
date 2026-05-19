// !252. Meeting Rooms

// !56. Merge Intervals
// var mergeInterval = function (
//   intervals = [
//     [1, 3],
//     [8, 10],
//     [2, 6],
//     [15, 18],
//   ],
// ) {
//   if (intervals.length <= 1) return intervals;

//   const res = [intervals[0]];
//   intervals.sort((a, b) => a[0] - b[0]);

//   for (let i = 1; i < intervals.length; i++) {
//     let current = intervals[i];
//     let lastAdded = res[res.length - 1];
//     if (current[0] <= lastAdded[1]) {
//       lastAdded[1] = Math.max(current[1], lastAdded[1]);
//     } else {
//       res.push(current);
//     }
//   }
//   return res;
// };
// console.log(mergeInterval());
