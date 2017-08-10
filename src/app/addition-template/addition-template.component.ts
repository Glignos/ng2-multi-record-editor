import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { SchemaKeysStoreService } from '../shared/services/schema-keys-store.service';

@Component({
  selector: 'addition-template',
  templateUrl: './addition-template.component.html',
  styleUrls: ['./addition-template.component.scss']
})


export class AdditionTemplateComponent implements OnInit {
  @Input() mainKey;
  keys = [];
  requiredKeys = [];
  map = {};
  constructor(private apiService: ApiService,
    private schemaKeysStoreService: SchemaKeysStoreService) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
      let subkeys,requiredSubkeys;
      this.keys = this.schemaKeysStoreService.forPath(this.mainKey);
      if (this.keys.length === 0){
        return
      }
      this.requiredKeys = this.schemaKeysStoreService.forPathReq(this.mainKey);
      this.keys.forEach((key,index) => {
        subkeys = this.schemaKeysStoreService.forPath(`${this.mainKey}/${key}`);
        if (subkeys.length > 0){
         this.keys.splice(index,1);
         this.keys = this.keys.concat(subkeys.map(x => {return `${key}->${x}`;}));
         requiredSubkeys = this.schemaKeysStoreService.forPathReq(`${this.mainKey}/${key}`);
         if(requiredSubkeys){
         this.requiredKeys = this.requiredKeys.concat(requiredSubkeys.map(x => `${key}->${x}`));
         }
        }
      })
    console.log(this.requiredKeys)
    }

}