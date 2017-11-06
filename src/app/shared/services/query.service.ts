/*
 * This file is part of ng2-multi-record-editor.
 * Copyright (C) 2017 CERN.
 *
 * record-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * record-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with record-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { environment } from '../../../environments/environment';
import { UserActions, QueryResult, RecordsPreview, RecordsToCompare } from '../interfaces';

@Injectable()
export class QueryService {
  private url = `${environment.baseUrl}/api/multieditor`;
  private schemaUrl = `${environment.baseUrl}/schemas/records`;

  constructor(private http: Http) { }

  save(userActions: UserActions, checkedRecords: string[], allSelected: boolean): Promise<void> {
    return this.http
      .post(`${this.url}/update`, {
        userActions,
        ids: checkedRecords,
        allSelected
      }
      ).map(res => res.json())
      .toPromise();
  }

  previewActions(userActions: UserActions, queryString: string, page: number, pageSize: number): Promise<RecordsPreview> {
    return this.http
      .post(`${this.url}/preview`, {
        userActions,
        queryString,
        pageNum: page,
        pageSize
      }).map(res => res.json())
      .toPromise();
  }

  fetchBundledRecords(query: string, page: number, collection: string, pageSize: number,
     userActions: UserActions): Observable<RecordsToCompare> {
    return Observable.zip(
      this.searchRecords(query, page, collection, pageSize)
      ,
      this.http
        .post(`${this.url}/preview`, {
          userActions,
          queryString: query,
          pageSize,
          pageNum: page,
        }).map(res => res.json()),
      (oldRecords, newRecords) => {
        return {
          oldRecords,
          newRecords
        };
      });
  }

  searchRecords(query: string, page: number, collection: string, pageSize: number): Observable<QueryResult> {
    return this.http
      .get(`${this.url}/search?pageNum=${page}&queryString=${query}&index=${collection}&pageSize=${pageSize}`)
      .map(res => res.json());
  }

  fetchCollectionSchema(selectedCollection: string): Promise<object> {
    return this.http
      .get(`${this.schemaUrl}/${selectedCollection}.json`)
      .map(res => res.json())
      .toPromise();
  }
}
