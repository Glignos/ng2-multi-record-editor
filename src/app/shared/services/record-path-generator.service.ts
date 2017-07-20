import { Injectable } from '@angular/core';
import { fromJS, Map, OrderedSet } from 'immutable';

@Injectable()
export class RecordPathGeneratorService {

  constructor() { }

  public run_action(record: object, key: string, action: string, value: string, values_to_check: string[]) {
    this.create_path_recursively(record, key, action, values_to_check, value);
    return record;  
    //this.setToValue(record, value, this.create_path_recursively(record, key, action, values_to_check, value_to_change));
    //return record;
  }
  /*private setToValue(record: Object, value: any, path_list: string[]) {//fixme
    var i;
    let selector;
    for (let index in path_list) {
      let path = path_list[index].split('.');
      let temp_record = record;
      for (i = 0; i < path.length - 1; i++) {
        if (path[i][0] === '[') {
          let selector = Number(path[i].slice(1, -1));
          temp_record = temp_record[Number(path[i].slice(1, -1))];
        }
        else {
          temp_record = temp_record[path[i]];
        }
      }
      if (path[i][0] === '[') {
        selector = Number(path[i].slice(1, -1));
      }
      else {
        selector = path[i];
      }
      temp_record[selector] = value;
    }
  }


  private connect_paths(path_1: string, path_list_2: string[]) {
    let final_path_list: string[] = [];
    for (let index in path_list_2) {
      final_path_list.push(`${path_1}.${path_list_2[index]}`);
    }
    return final_path_list;
  }*/

  public create_path_recursively(record: any, key: string, action: string, values_to_check: string[], value_to_change: string) {//fixme type?
    let path = ''
    //let array_path: string[] = [];
    //let array_path2: string[] = [];
    let curr_key = key.substring(0, key.indexOf('/'));
    key = key.substring(key.indexOf('/') + 1);
    if (curr_key === '') {
      curr_key = key;
      key = '';
    }
    let temp_record = record[curr_key];
    if (Array.isArray(temp_record)) {
      for (let index = 0; index < temp_record.length; index++) {
        if (key === '') {
          if (action === 'update' && values_to_check.includes(temp_record[index])) {
            //array_path.push(`${curr_key}.[${index}]`);
            record[curr_key][index] = value_to_change;
            //return record;
          }
          else if (action === 'add') {
            //array_path.push(`${curr_key}.[${index}]`);
            record[curr_key][length] = value_to_change;
            return;
          }
          else if (action === 'delete' && values_to_check.includes(record)) {
          record[curr_key].pop(curr_key);
          //return record
          //return [`${curr_key}`];
        }
        }
        else {
          //array_path2 = this.create_path_recursively(record[index], key, action, values_to_check, value_to_change);
          //temp_record = 
          this.create_path_recursively(temp_record[index], key, action, values_to_check, value_to_change);
          /*if(temp_record){
            record[curr_key][index] = temp_record
            //return record;
          }
          else {
          //return null;
        }*/
          /*if (array_path2) {
            array_path2 = this.connect_paths(`${curr_key}.[${index}]`, array_path2)
            for (let index in array_path2) {
              array_path.push(array_path2[index]);
            }
          }*/
        }
      }
      //return array_path;
      //return record;
    }
    else {
      if (key === '') {
        if (action === 'update' && values_to_check.includes(record)) {
          record[curr_key] = value_to_change
          //return record
          //return [`${curr_key}`];
        }
        else if (action === 'add') {
          record[curr_key] = value_to_change
          //return record
          //return [`${curr_key}`];
        }
        else if (action === 'delete' && values_to_check.includes(record)) {
          delete record[curr_key]
          //return record
          //return [`${curr_key}`];
        }
      }
      else {
        //array_path2 = this.create_path_recursively(record, key, action, values_to_check, value_to_change);
        //temp_record = 
        this.create_path_recursively(temp_record, key, action, values_to_check, value_to_change);
        /*if(temp_record){
          record[curr_key] = temp_record
          //return record;
        }*/
        /*else {
          //return null;
        }*/
        /*if (array_path2) {
          return this.connect_paths(`${curr_key}`, array_path2);
        }*/
      }

    }
    //return [];
    //return record;
  }
}
