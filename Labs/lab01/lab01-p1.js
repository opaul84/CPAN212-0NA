import lodash from "lodash"
const holidays = [
    {name:"christimas", date: new Date("2025-12-25")},
    {name:"Canada Day", date: new Date("2025-07-01")},
    {name:"Apil Fools", date: new Date("2025-04-01")},

]

let today = new Date();

holidays.forEach(holiday =>{
    let datedifference = holiday.date - today;
    console.log(Math.ceil(datedifference/(1000*60*60*24)));

});

let random_holiday = lodash.sample(holidays);
console.log( random_holiday);

console.log(lodash.findIndex(holidays, {name: "Christmas"}));
console.log(lodash.findIndex(holidays, {name: "Canada Day"}));
console.log(lodash.findIndex(holidays, {name: "April Fools"}));

