import { Pipe, PipeTransform,Input } from '@angular/core';

@Pipe({
  name: 'toggleText'
})
export class ToggleTextPipe implements PipeTransform {

  transform(text: any, maxLength: number, isCollapsed: boolean): any {
    var currentText: string;
        let title = text['titles'][0]['title'];
        let date = text['preprint_date'];
        let stringed_text = JSON.stringify(text);  
        if (stringed_text.length <= maxLength) {
            currentText = stringed_text;
            isCollapsed = false;
            return;
        }
        if (isCollapsed == true) {
            currentText = 'Title : ' + title + '<br>Date : ' + date;
        } else if(isCollapsed == false)  {
            currentText = '';
            for (let value in text){
                currentText= currentText + `${value} : ${JSON.stringify(text[value])}<br>`
            }
        }
        return  currentText;
    }
  }



