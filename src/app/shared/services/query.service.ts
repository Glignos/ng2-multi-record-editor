import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { environment } from '../../../environments/environment';
import { UserActions } from '../interfaces';

@Injectable()
export class QueryService {
  readonly url = `${environment.baseUrl}/api/multieditor`;
  readonly schemaUrl = `${environment.baseUrl}/schemas/records`;
  options: any;
  readonly matchTypesMap = {
    'contains': 'contains',
    'is equal to': 'exact',
    'does not exist': 'missing',
    'matches regular expression': 'regex'
  };
  constructor(private http: Http) {
    document.cookie = '_pk_id.11.1fff=99911b90596f9e8d.1504879999.2.1505216503.1505216503.; _pk_ses.11.1fff=*';
    this.options = this.createAuthorizationHeader(); }
  submitActions(userActions: UserActions, checkedRecords: string[]): Promise<void> {
    return this.http
      .post(`${this.url}/update`, {
        userActions,
        ids: checkedRecords,
      }).map(res => res.json())
      .toPromise();
  }

  createAuthorizationHeader(): any {
       let headers = new Headers();
       headers.append('Access-Control-Allow-Origin', 'localhost:4200');
       headers.append('Access-Control-Allow-Credentials', 'true');
       let options = new RequestOptions({ headers: headers, withCredentials: true });
       return options;
      }

  previewActions(userActions: UserActions, queryString: string, pageNum: number, pageSize: number): Promise<object[]> {
    this.resolveMatchMap(userActions);
    return this.http
      .post(`${this.url}/preview`, {
        userActions,
        queryString,
        pageNum,
        pageSize
      }, this.options).map(res => res.json())
      .toPromise();
  }

  fetchNewPageRecords(userActions: UserActions, queryString: string, page: number, collection: string, pageSize: number): Observable<any> {
    this.resolveMatchMap(userActions);
    return Observable.zip(
      this.http
        .get(`${this.url}/search?pageNum=${page}&query_string=${queryString}&index=${collection}&pageSize=${pageSize}`, this.options)
        .map(res => res.json()),
      this.http
        .post(`${this.url}/preview`, {
          userActions,
          queryString,
          pageSize,
          pageNum: page,
        }, this.options).map(res => res.json()),
      (oldRecords, newRecords) => {
        return {
          oldRecords,
          newRecords
        };
      });
  }

  searchRecords(query: string, page: number, collection: string, pageSize: number): Promise<object> {
    return this.http
      .get(`${this.url}/search?pageNum=${page}&queryString=${query}&index=${collection}&pageSize=${pageSize}`, this.options)
      .map(res => res.json())
      .toPromise();
  }

  fetchCollectionSchema(selectedCollection: string): Promise<object> {
    return this.http
      .get(`${this.schemaUrl}/${selectedCollection}.json`)
      .map(res => res.json())
      .toPromise();
  }

  resolveMatchMap(userActions: UserActions) {
    userActions.conditions.forEach(element => {
      element.matchType = this.matchTypesMap[element.matchType];
    });
  }
}
