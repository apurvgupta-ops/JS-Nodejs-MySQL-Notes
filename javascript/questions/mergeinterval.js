// !252. Meeting Rooms
// var canAttendMeetings = function (intervals) {
//   intervals.sort((a, b) => a[0] - b[0]);
//   for (let i = 1; i < intervals.length; i++) {
//     // This is short hand
//     // if (intervals[i][0] < intervals[i - 1][1]) return false;

//     let current = intervals[i];
//     let previous = intervals[i - 1];
//     if (current[0] < previous[1]) return false;
//   }
//   return true;
// };
// console.log(
//   canAttendMeetings([
//     [0, 5],
//     [10, 15],
//     [20, 25],
//   ]),
// );

// !56. Merge Intervals
// var mergeInterval = function (
//   intervals = [
//     [4, 7],
//     [1, 4],
//   ],
// ) {
//   if (intervals.length <= 1) return intervals;

//   intervals.sort((a, b) => a[0] - b[0]);
//   let res = [intervals[0]];

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

// !57. Insert Interval
// var insert = function (
//   intervals = [
//     [1, 2],
//     [3, 5],
//     [6, 7],
//     [8, 10],
//     [12, 16],
//   ],
//   newInterval = [4, 8],
// ) {
//   if (intervals.length === 0) return [newInterval];

//   let res = [];
//   let i = 0;

//   // Add all intervals that come before the new interval
//   while (i < intervals.length && intervals[i][1] < newInterval[0]) {
//     res.push(intervals[i]);
//     i++;
//   }

//   // Merge overlapping intervals with the new interval
//   while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
//     newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
//     newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
//     i++;
//   }
//   res.push(newInterval);

//   // Add remaining intervals
//   while (i < intervals.length) {
//     res.push(intervals[i]);
//     i++;
//   }

//   return res;
// };

// console.log(insert());

// !435. Non-overlapping Intervals
// var eraseOverlapIntervals = function (intervals = [[1, 2]]) {
//   if (intervals.length <= 1) return 0;

//   intervals.sort((a, b) => a[1] - b[1]);
//   let prevEnd = intervals[0][1];
//   let count = 0;
//   for (let i = 1; i < intervals.length; i++) {
//     let currentStart = intervals[i][0];
//     let currentEnd = intervals[i][1];

//     if (currentStart < prevEnd) {
//       count++;
//     } else {
//       prevEnd = currentEnd;
//     }
//   }
//   return count;
// };

// console.log(eraseOverlapIntervals());

// !452. Minimum Number of Arrows to Burst Balloons
// var findMinArrowShots = function (
//   points = [
//     [10, 16],
//     [2, 8],
//     [1, 6],
//     [7, 12],
//   ],
// ) {
//   if (points.length <= 1) return 1;

//   points.sort((a, b) => a[1] - b[1]);
//   let prevEnd = points[0][1];
//   let arrows = 1;
//   for (let i = 1; i < points.length; i++) {
//     let currentStart = points[i][0];
//     let currentEnd = points[i][1];

//     if (currentStart > prevEnd) {
//       arrows++;
//       prevEnd = currentEnd;
//     }
//   }
//   return arrows;
// };

// console.log(findMinArrowShots());

// !253. Meeting Rooms II
// var minMeetingRooms = function (
//   intervals = [
//     [0, 40],
//     [5, 10],
//     [15, 20],
//   ],
// ) {
//   if (intervals.length <= 1) return intervals.length;
//   let startTimes = intervals
//     .map((interval) => interval[0])
//     .sort((a, b) => a - b);
//   let endTimes = intervals.map((interval) => interval[1]).sort((a, b) => a - b);

//   let startPointer = 0;
//   let endPointer = 0;

//   let currentRooms = 0;
//   let maxRooms = 0;

//   while (startPointer < intervals.length) {
//     if (startTimes[startPointer] < endTimes[endPointer]) {
//       currentRooms++;
//       startPointer++;
//     } else {
//       currentRooms--;
//       endPointer++;
//     }
//     maxRooms = Math.max(maxRooms, currentRooms);
//   }
//   return maxRooms;
// };
// console.log(minMeetingRooms());

// !1288. Remove Covered Intervals
// var removeCoveredIntervals = function (intervals) {
//   if (intervals.length <= 1) return intervals.length;

//   intervals.sort((a, b) => {
//     if (a[0] === b[0]) {
//       return b[1] - a[1]; // Sort by end time in descending order if start times are the same
//     }
//     return a[0] - b[0]; // Sort by start time in ascending order
//   });

//   let count = 0;
//   let maxEnd = 0;

//   for (let i = 0; i < intervals.length; i++) {
//     let currentEnd = intervals[i][1];

//     if (currentEnd > maxEnd) {
//       count++;
//       maxEnd = currentEnd; // Expand our tracked boundary
//     }
//   }
//   return count;
// };

// console.log(
//   removeCoveredIntervals([
//     [1, 4],
//     [3, 6],
//     [2, 8],
//   ]),
// );
