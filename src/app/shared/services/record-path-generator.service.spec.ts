import { TestBed, inject } from '@angular/core/testing';

import { RecordPathGeneratorService } from './record-path-generator.service';

describe('RecordPathGeneratorService', () => {
  let service: RecordPathGeneratorService;
  beforeEach(() => {
    service = new RecordPathGeneratorService();
    });


  it('should test create_path_recursively for nested complex object', () => {
    let record = { a: [1, 2, 3, 4], b: { c: {d:'pong'} } 
    };
    let expectedMap = ['b.c.d'];
    let key = 'b/c/d';
    let action = 'update';
    let update_value = ['pong'];
    expect(service.create_path_recursively(record,key,action,update_value)).toEqual(expectedMap);

  });

   it('should test create_path_recursively for nested complex array', () => {
    let record = { a: [{bla:['val5','val4']}, {bla:['val1','val4']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let expectedMap = ['a.[0].bla.[1]','a.[1].bla.[1]'];
    let key = 'a/bla';
    let action = 'update';
    let update_value = ['val4'];
    expect(service.create_path_recursively(record,key,action,update_value)).toEqual(expectedMap);

  });

    it('should test create_path_recursively for nested complex array', () => {
    let record = { a: [{bla:['val5','val4']}, {bla:['val1','val4']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let expectedMap = ['a.[0].bla.[0]','a.[0].bla.[1]','a.[1].bla.[1]'];
    let key = 'a/bla';
    let action = 'update';
    let update_value = ['val4','val5'];
    expect(service.create_path_recursively(record,key,action,update_value)).toEqual(expectedMap);

  });

  it('should test record edit for nested complex array', () => {
    let record = { a: [{bla:['val5','val4']}, {bla:['val1','val4']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let expectedMap = { a: [{bla:['val5','success']}, {bla:['val1','success']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let key = 'a/bla';
    let action = 'update';
    let values_to_check = ['val4'];
    let value = 'success'
    expect(service.run_action(record,key,action,value,values_to_check)).toEqual(expectedMap);

  });

   it('should test record edit for nested complex array and multiple check values', () => {
    let record = { a: [{bla:['val5','val4']}, {bla:['val1','val4']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let expectedMap = { a: [{bla:['success','success']}, {bla:['val1','success']}, {bla:['val2']}, {bla:['val3']}], b: { c: {d:'pong'} } 
    };
    let key = 'a/bla';
    let action = 'update';
    let values_to_check = ['val4','val5'];
    let value = 'success'
    expect(service.run_action(record,key,action,value,values_to_check)).toEqual(expectedMap);


  });

  
});
