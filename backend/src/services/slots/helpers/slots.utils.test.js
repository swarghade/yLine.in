/*const {timeSlotGenerator} = require('./slots.utils')

console.log(timeSlotGenerator('11:00','13:30',30,3,new Date()))
*/
/*
let testCases = [
  {
    input: ['11:00','13:30',30],
    output: [['11:00','11:30'],['11:30','12:00'],['12:00','12:30'],['12:30','13:00'],['13:00','13:30']]
  },
  {
    input: ['1:00','1:30',10],
    output: [['01:00','01:10'],['01:10','01:20'],['01:20','01:30']]
  },
  {
    input: ['1:01','1:10',3],
    output: [['01:01','01:04'],['01:04','01:07'],['01:07','01:10']]
  },
  {
    input: ['1:01','1:10',4],
    output: [['01:01','01:05'],['01:05','01:09']]
  },

];


testCases.forEach( (k,i) => {
  test(` time slot generation [${k.input}]  `, ()=> {
    expect(timeSlotGenerator( ...k['input' ])).toEqual(k['output']);
    expect(timeSlotGenerator( ...k['input' ])).toEqual(k['output']);  
  } );
  
} )


test( ' Check dangerous input ', () => {
  expect( () => timeSlotGenerator( '01:00', 5, null  ) ).toThrow(Error);
  expect( () => timeSlotGenerator( null, 552, -50  )).toThrow(Error);
  //expect( () => timeSlotGenerator( '01:00', '-3', 5  )).toThrow(Error);
} )
*/




