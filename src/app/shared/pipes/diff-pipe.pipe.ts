import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diffPipe'
})
export class DiffPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let text = JSON.stringify(value, undefined, 2);
    let comment_number = 1;
    let sizeToReplace = `"comment_${comment_number}": "added"`.length;
    let split_text = text.split(`"comment_${comment_number}": "added"`);
    while (split_text.length > 1){
        comment_number++;
        split_text[1] = this.insertAt(split_text[1], 0, '<p class="alert alert-success">', 1);
        split_text[1] = this.insertAt(split_text[1], split_text[1].indexOf(`"comment_${comment_number}": "added"`),
         '</p>', sizeToReplace);
        comment_number++;
        text = split_text[0].concat(split_text[1])
        split_text = text.split(`"comment_${comment_number}": "added"`);
    }
    return text;
  }

  private insertAt(src, index, str ,sizeToReplace) {
    return src.substr(0, index) + str + src.substr(index + sizeToReplace)
  }
}
