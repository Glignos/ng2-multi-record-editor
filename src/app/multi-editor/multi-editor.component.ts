import { Component,Input,Output, OnInit, EventEmitter, ElementRef  } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { SchemaKeysStoreService } from '../shared/services/schema-keys-store.service';
import { Observable } from 'rxjs';




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
  schema: {};

  constructor(private apiService: ApiService,
    private schemaKeysStoreService: SchemaKeysStoreService) { }

  ngOnInit() {
    Observable.zip(
      this.apiService.fetchUrl('../../assets/records.json'),
      this.apiService.fetchUrl('../../assets/schema.json'),
      (records, schema) => {
        return {
          records: records,
          schema: schema
        }
      }
    ).subscribe(data => {
      this.records = data.records;
      this.schema = data.schema;
      this.schemaKeysStoreService.buildSchemaKeyStore(this.schema);
    });
  }
}

