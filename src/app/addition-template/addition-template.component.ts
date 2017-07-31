import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { SchemaKeysStoreService } from '../shared/services/schema-keys-store.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'addition-template',
  templateUrl: './addition-template.component.html',
  styleUrls: ['./addition-template.component.scss']
})


export class AdditionTemplateComponent implements OnInit {
  @Input() mainKey;
  keys = [];
  req_keys = [];
  map = {};
  constructor(private apiService: ApiService,
    private schemaKeysStoreService: SchemaKeysStoreService) { }

  ngOnInit() {
    this.keys = this.keys;
    this.req_keys = this.req_keys
  }

  

  ngOnChanges(changes) {
      let subkeys,req_subkeys;
      this.keys = this.schemaKeysStoreService.forPath(this.mainKey);
      this.req_keys = this.schemaKeysStoreService.forPathReq(this.mainKey);
      this.keys.forEach((key,index) => {
        subkeys = this.schemaKeysStoreService.forPath(`${this.mainKey}/${key}`);
        if (subkeys.length > 0){
         this.keys.splice(index,1);
         this.keys = this.keys.concat(subkeys.map(x => {return `${key}->${x}`;}));
         req_subkeys = this.schemaKeysStoreService.forPathReq(`${this.mainKey}/${key}`);
         if(req_subkeys){
         this.req_keys = this.req_keys.concat(req_subkeys.map(x => {return `${key}->${x}`;}));
         }
        }
      })
    console.log(this.req_keys)
    }

}
