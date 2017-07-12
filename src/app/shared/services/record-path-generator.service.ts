import { Injectable } from '@angular/core';
import { fromJS, Map, OrderedSet } from 'immutable';

@Injectable()
export class RecordPathGeneratorService {

  constructor() { }

  public run_action(record:object,key:string,action:string,value:string,values_to_check:string[]){
    this.setToValue(record,value,this.create_path_recursively(record,key,action,values_to_check));
    return record;
  }
  private setToValue(record: Object, value: any, path_list: string[]) {//fixme
    var i;
    let selector;
    for (let index in path_list) {
      let path = path_list[index].split('.');
      let temp_record = record;
      for (i = 0; i < path.length - 1; i++){
        if (path[i][0] === '[') {
          let selector=Number(path[i].slice(1, -1));
          temp_record = temp_record[Number(path[i].slice(1, -1))];
        }
        else {
          temp_record = temp_record[path[i]];
        }
      }
      if (path[i][0] === '[') {
          selector=Number(path[i].slice(1, -1));
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
  }

  public create_path_recursively(record: any, key: string, action: string, values_to_check: string[]) {//fixme type?
    let path = ''
    let array_path: string[] = [];
    let array_path2: string[] = [];
    let curr_key = key.substring(0, key.indexOf('/'));
    key = key.substring(key.indexOf('/') + 1);
    if (curr_key === '') {
      curr_key = key;
      key = '';
    }
    record = record[curr_key];
    if (Array.isArray(record)) {
      for (let index = 0; index < record.length; index++) {
        if (key === '') {
          if (action === 'update' && values_to_check.includes(record[index])) {
            array_path.push(`${curr_key}.[${index}]`);
          }
        }
        else {
          array_path2 = this.create_path_recursively(record[index], key, action, values_to_check);
          if (array_path2) {
            array_path2 = this.connect_paths(`${curr_key}.[${index}]`, array_path2)
            for (let index in array_path2) {
              array_path.push(array_path2[index]);
            }
          }
        }
      }
      return array_path;
    }
    else {
      if (key === '') {
        if (action === 'update' && values_to_check.includes(record)) {
          return [`${curr_key}`];
        }
      }
      else {
        array_path2 = this.create_path_recursively(record, key, action, values_to_check);
        if (array_path2) {
          return this.connect_paths(`${curr_key}`, array_path2);
        }
      }

    }
    return [];
  }
}
