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
  schema: object;
  errorText: string;
  recordErrors: string[];
  lastSearchedQuery = '';
  lastSearchedCollection: string;
  previewedActions: UserActions;
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

  readonly pageSizes = [5, 10, 15, 20];
  pageSize = this.pageSizes[1];


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

  onSubmit() {
    this.queryService.submitActions(this.previewedActions, this.checkedRecords)
      .catch((error) => {
        this.errorText = error;
      });
  }

  get userActions(): UserActions {
    return this.userActionsService.getUserActions();
  }

  onPreviewClick() {
    this.previewedActions = this.userActions;
    this.queryService.previewActions(this.userActions, this.lastSearchedQuery, this.currentPage, this.pageSize)
      .then((res) => {
        this.newRecords = res['json_records'];
        this.recordErrors = res['errors'];
        this.previewMode = true;
        this.changeDetectorRef.markForCheck();
      })
      .catch((error) => {
        this.errorText = error;
        this.changeDetectorRef.markForCheck();
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.previewMode ? this.getNewPageRecords() : this.queryCollection(this.lastSearchedQuery, this.lastSearchedCollection);
  }

  searchRecords(query: string) {
    this.lastSearchedCollection = this.selectedCollection;
    if (!query) {
      query = '';
    }
    this.lastSearchedQuery = query;
    this.queryCollection(query, this.selectedCollection);
  }

  onCollectionChange(selectedCollection: string) {
    this.selectedCollection = selectedCollection;
    this.queryService.fetchCollectionSchema(this.selectedCollection)
      .then((res) => {
        this.schema = res;
        this.schemaKeysStoreService.buildSchemaKeyStore(this.schema);
      })
      .catch(error => {
        this.errorText = error;
        this.changeDetectorRef.markForCheck();
      }
      );
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.onPageChange(this.currentPage);
  }

  trackByFunction(index: number): number {
    return index;
  }

  private addChecked(uuid: string) {
    this.checkedRecords.includes(uuid) ? this.checkedRecords.splice(this.checkedRecords.indexOf(uuid), 1)
      : this.checkedRecords.push(uuid);
  }

  private selectAll() {
    this.checkedRecords = [];
  }

  private getNewPageRecords() {
    this.queryService
      .fetchNewPageRecords(this.previewedActions, this.lastSearchedQuery, this.currentPage, this.lastSearchedCollection, this.pageSize)
      .subscribe((json) => {
        this.records = json.oldRecords['json_records'];
        this.uuids = json.oldRecords['uuids'];
        this.newRecords = json.newRecords['json_records'];
        this.recordErrors = json.newRecords['errors'];
        this.changeDetectorRef.markForCheck();
      },
      error => { this.errorText = error; this.changeDetectorRef.markForCheck(); });
  }

  filterNewRecord(record: {}): {} {
    let _record = Object.assign({}, record);
    if (this.filterExpression) {
      return this.jsonUtilsService.filterJson(_record, [this.filterExpression]);
    }
    return record;
  }

  private queryCollection(query, collection) {
    this.queryService.searchRecords(query, this.currentPage, collection, this.pageSize)
      .then((json) => {
        this.records = json['json_records'];
        this.totalRecords = json['total_records'];
        this.uuids = json['uuids'];
        this.changeDetectorRef.markForCheck();
      })
      .catch(error => {
        this.errorText = error;
        this.changeDetectorRef.markForCheck();
      }
      );
  }

}


