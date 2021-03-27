export const courses_sm = [
  {
    id: 1,  
    title: "CS 336", 
    lecTimes: {
      fall: [{start: [1, 0, 1], end: [2, 30, 1], dow: [0, 1, 0, 1, 0]}],
      winter: [{start: [9, 30, 0], end: [10, 50, 0], dow: [0, 1, 0, 1, 0]}],
      spring: [{start: [9, 30, 0], end: [10, 50, 0], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "fall",
    prereqs: null,
    coreqs: null
  },
  {
    id: 2,  
    title: "CS 348", 
    lecTimes: {
      fall: [{start: [4, 20, 1], end: [5, 40, 1], dow: [1, 0, 1, 0, 0]}],
      winter: [{start: [2, 0, 1], end: [3, 20, 1], dow: [1, 0, 1, 0, 0]}],
      spring: [{start: [12, 30, 1], end: [1, 50, 1], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "fall",
    prereqs: null,
    coreqs: null
  },
  {
    id: 3,  
    title: "CS 321", 
    lecTimes: {
      fall: [{start: [11, 20, 0], end: [12, 40, 1], dow: [0, 1, 0, 1, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [11, 20, 0], end: [12, 40, 1], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: false,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 4,  
    title: "CS 337", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [3, 30, 1], end: [4, 50, 1], dow: [1, 0, 1, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: false,
      winter: true,
      spring: false
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: [2],
    coreqs: null
  },
  {
    id: 5,  
    title: "Math 308", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [1, 0, 1, 0, 1]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [0, 0, 0, 1, 0]}]
    },
    available: {
      fall: false,
      winter: false,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: true
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  }
];

export const courses_lg = [
  {
    id: 1,  
    title: "CS 336", 
    lecTimes: {
      fall: [{start: [1, 0, 1], end: [2, 30, 1], dow: [0, 1, 0, 1, 0]}],
      winter: [{start: [9, 30, 0], end: [10, 50, 0], dow: [0, 1, 0, 1, 0]}],
      spring: [{start: [9, 30, 0], end: [10, 50, 0], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "fall",
    prereqs: null,
    coreqs: null
  },
  {
    id: 2,  
    title: "CS 339", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [3, 30, 1], end: [4, 50, 1], dow: [0, 1, 0, 1, 0]}],
      spring: [{start: [3, 30, 1], end: [4, 50, 1], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: false,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 3,  
    title: "CS 348", 
    lecTimes: {
      fall: [{start: [4, 20, 1], end: [5, 40, 1], dow: [1, 0, 1, 0, 0]}],
      winter: [{start: [2, 0, 1], end: [3, 20, 1], dow: [1, 0, 1, 0, 0]}],
      spring: [{start: [12, 30, 1], end: [1, 50, 1], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "fall",
    prereqs: null,
    coreqs: null
  },
  {
    id: 4,  
    title: "CS 349", 
    lecTimes: {
      fall: [{start: [9, 10, 0], end: [10, 0, 0], dow: [1, 0, 1, 0, 1]}],
      winter: [{start: [11, 0, 0], end: [12, 20, 1], dow: [1, 0, 1, 0, 0]}],
      spring: [{start: [3, 30, 1], end: [4, 50, 1], dow: [1, 0, 1, 0, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: true,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 5,  
    title: "CS 321", 
    lecTimes: {
      fall: [{start: [11, 20, 0], end: [12, 40, 1], dow: [0, 1, 0, 1, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [11, 20, 0], end: [12, 40, 1], dow: [0, 1, 0, 1, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: false,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 6,  
    title: "CS 330", 
    lecTimes: {
      fall: [{start: [11, 30, 0], end: [12, 20, 1], dow: [1, 0, 1, 0, 1]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: false,
      spring: false
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 7,  
    title: "CS 337", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [3, 30, 1], end: [4, 50, 1], dow: [1, 0, 1, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: false,
      winter: true,
      spring: false
    },
    disc: {
      fall: false,
      winter: false,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: [3],
    coreqs: null
  },
  {
    id: 8,  
    title: "Math 306", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [10, 0, 0], end: [10, 50, 0], dow: [1, 0, 1, 0, 1]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [10, 0, 0], end: [10, 50, 0], dow: [0, 0, 0, 1, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: false,
      winter: true,
      spring: false
    },
    disc: {
      fall: false,
      winter: true,
      spring: false
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 9,  
    title: "Math 308", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [1, 0, 1, 0, 1]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [0, 0, 0, 1, 0]}]
    },
    available: {
      fall: false,
      winter: false,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: true
    },
    series: false,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 10,  
    title: "Math 310-1", 
    lecTimes: {
      fall: [{start: [9, 0, 0], end: [9, 50, 0], dow: [1, 0, 1, 0, 1]},
            {start: [11, 0, 0], end: [11, 50, 0], dow: [1, 0, 1, 0, 1]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [1, 0, 1, 0, 1]}]
    },
    discTimes: {
      fall: [{start: [9, 0, 0], end: [9, 50, 0], dow: [0, 0, 0, 1, 0]},
            {start: [11, 0, 0], end: [11, 50, 0], dow: [1, 0, 1, 0, 1]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: true,
      winter: false,
      spring: false
    },
    disc: {
      fall: true,
      winter: false,
      spring: false
    },
    series: true,
    seriesIndex: 0, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 11,  
    title: "Math 310-2", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [9, 0, 0], end: [9, 50, 0], dow: [1, 0, 1, 0, 1]},
              {start: [11, 0, 0], end: [11, 50, 0], dow: [1, 0, 1, 0, 1]}],
      spring: [{start: [10, 0, 0], end: [10, 50, 0], dow: [1, 0, 1, 0, 1]}]
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [9, 0, 0], end: [9, 50, 0], dow: [0, 0, 0, 1, 0]},
              {start: [11, 0, 0], end: [11, 50, 0], dow: [0, 0, 0, 1, 0]}],
      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
    },
    available: {
      fall: false,
      winter: true,
      spring: false
    },
    disc: {
      fall: false,
      winter: true,
      spring: false
    },
    series: true,
    seriesIndex: 1, 
    pref: "",
    prereqs: null,
    coreqs: null
  },
  {
    id: 12,  
    title: "Math 310-3", 
    lecTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [9, 0, 0], end: [9, 50, 0], dow: [1, 0, 1, 0, 1]},
              {start: [11, 0, 0], end: [11, 50, 0], dow: [1, 0, 1, 0, 1]}],
    },
    discTimes: {
      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
      spring: [{start: [9, 0, 0], end: [9, 50, 0], dow: [0, 0, 0, 1, 0]},
              {start: [11, 0, 0], end: [11, 50, 0], dow: [0, 0, 0, 1, 0]}]
    },
    available: {
      fall: false,
      winter: false,
      spring: true
    },
    disc: {
      fall: false,
      winter: false,
      spring: true
    },
    series: true,
    seriesIndex: 2, 
    pref: "",
    prereqs: null,
    coreqs: null
  } 
];