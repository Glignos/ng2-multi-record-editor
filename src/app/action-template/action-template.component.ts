import { Component, OnInit } from '@angular/core';


const ACTIONS: string[] = ['Addition','Deletion','Update'];


@Component({
  selector: 'action-template',
  templateUrl: './action-template.component.html',
  styleUrls: ['./action-template.component.scss']
})

export class ActionTemplateComponent implements OnInit {
  actions: string[];
  selectedAction;
  constructor() { }
  mainKey='';
  replaceValue;
  whereKey;
  whereValue;
  value;
  ngOnInit() {
    this.actions = ACTIONS
    this.selectedAction = ACTIONS[0]
  }

 SubmitAction()
  {  let action: Object = {
    selectedAction: this.selectedAction,
    mainKey:this.mainKey,
    value:this.value,
    updateValue:this.replaceValue,
    whereKey:this.whereKey,
    whereValue:this.whereValue
  }
      return action;
  }
}
