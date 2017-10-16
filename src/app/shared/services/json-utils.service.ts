import { Injectable } from '@angular/core';
import { SchemaKeysStoreService } from './schema-keys-store.service';
import * as _ from 'lodash';

@Injectable()
export class JsonUtilsService {

  constructor(public schemaKeysStoreService:SchemaKeysStoreService) { }

  filterJsonArray(jsonArray: Array<{}>, filterExpression: string) {
    let _jsonArray = [];
    jsonArray.forEach(record => {
      // cast to array for now before adding multiple filter expressions
      let res = this.filterJson(record, [filterExpression]);
      if (!_.isEmpty(res)) {
        _jsonArray.push(res);
      }
    });
    return _jsonArray;
  }

  public filterJson(json: {}, paths: Array<string>) {
    let result = {};
    paths.forEach(path => {
      let res = this.filterJsonRecursively(Object.assign({}, json), path);
      if (res) {
        _.merge(result, res);
      }
    });
    return this.pickByDeep(result);
  }

  private filterJsonRecursively(json, path, pathIdx=0) {
    let pathSplit = path.split(this.schemaKeysStoreService.separator);
    let currentPath = pathIdx < pathSplit.length ? pathSplit[pathIdx] : undefined;

    if (!currentPath) {
      return json;
    }

    if (!json[currentPath]) {
      return undefined;
    }

    if (Array.isArray(json[currentPath])) {
      let tmpArray = [];
      json[currentPath].forEach(element => {
        let value = this.filterJsonRecursively(element, path, pathIdx+1);
        tmpArray.push(value);
      });
      return {[currentPath]: tmpArray};
    } else if (typeof json[currentPath] === 'object') {
      let res =  this.filterJsonRecursively(json[currentPath], path, pathIdx+1);
      if (!_.isEmpty(res)) {
        return {[currentPath]: res};
      } else {
        return undefined;
      }
    } else {
      return this.filterObject(json, currentPath);
    }
  }

  private filterObject(json: Object, value: string): Object {
    return Object.keys(json).reduce(function(obj, x) {
      if (x === value) {
        obj[x] = json[x];
      }
      return obj;
    }, {});
  }

  private pickByDeep(collection) {
    let picked = _.pickBy(collection, _.identity);
    let collections = _.pickBy(collection, _.isObject);

    _.each(collections, (item, key) => {
      let object;
      if (_.isArray(item)) {
        object = _.reduce(item, (result, value) => {
          let innerPicked = this.pickByDeep(value);
          if (!_.isEmpty(innerPicked)) {
            result.push(innerPicked);
          }
          return result;
        }, []);
      } else {
        object = this.pickByDeep(item);
      }

      if (!_.isEmpty(object)) {
        picked[key] = object;
      } else {
        delete picked[key];
      }
    });

    return picked;
  }
}
