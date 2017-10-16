import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core';
import { SchemaKeysStoreService } from '../shared/services/schema-keys-store.service';
import { ParsedAutocompleteInput } from '../shared/interfaces/parsed-autocomplete-input';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
  selector: 'me-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteInputComponent {

  @Input() className;
  @Input() placeholder;
  @Output() valueChange = new EventEmitter<string>();
  value = '';

  private readonly separator = '/';
  currentPath = '';
  dataSource: Observable<any>;

  typeaheadNoResults = false;

  constructor(private schemaKeysStoreService: SchemaKeysStoreService) {
    this.dataSource = Observable
    .create((observer: any) => {
      observer.next(this.value);
    })
    .map(inputValue => this.getStateForValue(inputValue))
    .do((state: ParsedAutocompleteInput) => {
      this.currentPath = state.path;
    })
    .mergeMap((state: ParsedAutocompleteInput) => {
      return Observable.of(
        this.schemaKeysStoreService.forPath(state.path).filter(item => item.startsWith(state.query))
      );
    });
  }

  selectUserInput(event) {
    this.value = this.currentPath !== '' ? `${this.currentPath}${this.separator}${event.value}` : event.value;
    this.valueChange.emit(this.value);
  }

  private getStateForValue(value): ParsedAutocompleteInput {
    let path = '';
    let query = '';
    let separatorIndex = value.lastIndexOf(this.separator);
    if (separatorIndex < 0) {
      path = '';
      query = value;
    } else if (separatorIndex === value.length - 1) {
      path = value.slice(0, -1);
      query = '';
    } else {
      path = value.slice(0, separatorIndex);
      query = value.slice(separatorIndex + 1);
    }
    return {path, query};
  }
}
