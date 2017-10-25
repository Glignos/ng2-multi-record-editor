import {
  Component, Input, Output, OnInit, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { SchemaKeysStoreService, QueryService, JsonUtilsService, UserActionsService } from '../shared/services';
import { UserActions } from '../shared/interfaces';

@Component({
  selector: 'me-multi-editor',
  templateUrl: 'multi-editor.component.html',
  styleUrls: ['multi-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MultiEditorComponent implements OnInit {
  records: object[];
  currentPage = 1;
  totalRecords = -1;
  pageSize = 10;
  schema: object;
  validationErrors: string[];
  lastSearchedQuery = '';
  lastSearchedCollection: string;
  previewedActions: UserActions;
  errorMessage: string;
  // records that are different from the general selection rule
  checkedRecords: string[] = [];
  previewMode = false;
  selectedCollection: string;
  newRecords: object[];
  uuids: string[] = [];
  filterExpression: string;

  readonly collections: object[] = [
    ['hep', 'HEP'],
    ['authors', 'Authors'],
    ['data', 'Data'],
    ['conferences', 'Conferences'],
    ['jobs', 'Jobs'],
    ['institutions', 'Institutions'],
    ['experiments', 'Experiments'],
    ['journals', 'Journals']
  ];


  constructor(
    private schemaKeysStoreService: SchemaKeysStoreService,
    private changeDetectorRef: ChangeDetectorRef,
    private queryService: QueryService,
    private userActionsService: UserActionsService,
    private jsonUtilsService: JsonUtilsService) { }

  ngOnInit() {
    this.newRecords = [];
    this.selectedCollection = this.collections[0][0];
    this.onCollectionChange('hep');
  }

  onSave() {
    this.queryService.save(this.previewedActions, this.checkedRecords)
      .catch((error) => {
        if (error.json().message) {
          this.totalRecords = -1;
          this.errorMessage = error.json().message;
        }else {
          this.errorMessage = error;
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  get userActions(): UserActions {
    return this.userActionsService.getUserActions();
  }

  onPreviewClick() {
    this.previewedActions = this.userActions;
    this.queryService.previewActions(this.userActions, this.lastSearchedQuery, this.currentPage, this.pageSize)
      .then((res) => {
        this.errorMessage = undefined;
        this.newRecords = res.json_records;
        this.validationErrors = res.errors;
        this.previewMode = true;
        this.changeDetectorRef.markForCheck();
      })
      .catch((error) => {
        if (error.json().message) {
        this.totalRecords = -1;
        this.errorMessage = error.json().message;
        }else {
          this.errorMessage = error;
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.previewMode ? this.getBundledRecords() : this.queryCollection(this.lastSearchedQuery, this.lastSearchedCollection);
  }

  searchRecords(query: string) {
    this.lastSearchedCollection = this.selectedCollection;
    if (!query) {
      query = '';
    }
    this.lastSearchedQuery = query;
    this.queryCollection(query, this.selectedCollection);
  }

  private queryCollection(query: string, collection: string) {
    this.queryService.searchRecords(query, this.currentPage, collection, this.pageSize)
      .toPromise()
      .then((json) => {
        this.previewMode = false;
        this.errorMessage = undefined;
        this.records = json['json_records'];
        this.totalRecords = json['total_records'];
        this.uuids = json['uuids'];
        this.changeDetectorRef.markForCheck();
      })
      .catch(error => {
        if (error.json().message) {
          this.totalRecords = -1;
          this.errorMessage = error.json().message;
        }else {
          this.errorMessage = error;
        }
        this.changeDetectorRef.markForCheck();
      }
      );
  }

  onCollectionChange(selectedCollection: string) {
    this.selectedCollection = selectedCollection;
    this.queryService.fetchCollectionSchema(this.selectedCollection)
      .then(res => {
        this.errorMessage = undefined;
        this.schema = res;
        this.schemaKeysStoreService.buildSchemaKeyStore(this.schema);
      })
      .catch(error => {
        this.errorMessage = error;
        this.changeDetectorRef.markForCheck();
      }
      );
  }

  trackByFunction(index: number): number {
    return index;
  }

  private addChecked(uuid: string) {
    this.checkedRecords.includes(uuid) ? this.checkedRecords.splice(this.checkedRecords.indexOf(uuid), 1)
      : this.checkedRecords.push(uuid);
  }

  private selectOrDeselectAll(value: boolean) {
    if (value) {
      this.checkedRecords = [];
    }else {
      this.checkedRecords = this.uuids.slice();
    }
    this.changeDetectorRef.markForCheck();
  }

  private getBundledRecords() {
    this.queryService
      .fetchBundledRecords(this.lastSearchedQuery, this.currentPage, this.lastSearchedCollection, this.pageSize, this.previewedActions)
      .subscribe((json) => {
        this.records = json.oldRecords.json_records;
        this.errorMessage = undefined;
        this.uuids = json.oldRecords.uuids;
        this.newRecords = json.newRecords.json_records;
        this.validationErrors = json.newRecords.errors;
        this.changeDetectorRef.markForCheck();
      },
      error => { this.errorMessage   = error; this.changeDetectorRef.markForCheck(); });
  }

  filterRecord(record: object): object {
    if (this.filterExpression) {
      return this.jsonUtilsService.filterObject(record, [this.filterExpression]);
    }
    return record;
  }

  filterRecords(newFilterExpression) {
    this.filterExpression = newFilterExpression;
    this.changeDetectorRef.markForCheck();
  }

}


