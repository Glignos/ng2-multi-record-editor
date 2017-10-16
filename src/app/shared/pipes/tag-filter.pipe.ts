import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { JsonUtilsService } from '../services/json-utils.service';


@Pipe({
  name: 'tagFilter'
})
export class TagFilterPipe implements PipeTransform {

  constructor(public jsonUtilsService: JsonUtilsService) { }

  transform(records: Array<{}>, filterExpression: string): any {
    if (filterExpression) {
      return this.jsonUtilsService.filterJsonArray(records, filterExpression);
    }
    return records;
  }

}
