import { Component,Input,Output, OnInit, EventEmitter, ElementRef  } from '@angular/core';
import { ApiService } from '../shared/services/api.service';




const COLLECTIONS: string[] = [
  'CDS',
  'HEP',
  'MARVEL'
];

@Component({
  selector: 'multi-editor',
  templateUrl: 'multi-editor.component.html',
  styleUrls: ['multi-editor.component.scss'],
})
export class MultiEditorComponent implements OnInit {
  p: number = 1;
  records: Array<{}>;
  collections= COLLECTIONS;
  total = 0;
  constructor(private apiService: ApiService) { }
  search_term = ''
  filter = 'Filter by'
  
  ngOnInit() {
    this.apiService.fetchUrl('../../assets/mock-data.json')
      .then(records => {
        this.records = records;
        this.total = records.length;
      })
  }

}

