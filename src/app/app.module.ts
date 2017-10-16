import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MultiEditorComponent } from './multi-editor';
import { SHARED_SERVICES, SHARED_PIPES } from './shared';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ActionTemplateComponent} from './action';
import { ActionsComponent } from './actions/actions.component';
import { DiffViewComponent } from './diff-view/diff-view.component';
import { JsonEditorModule } from 'ng2-json-editor';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AddActionComponent } from './add-action/add-action.component';
import { DeleteActionComponent } from './delete-action/delete-action.component';
import { UpdateActionComponent } from './update-action/update-action.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { EditorToolbarContainerComponent } from './editor-toolbar-container/editor-toolbar-container.component';
import { EditorToolbarSaveComponent } from './editor-toolbar-container/editor-toolbar-save/editor-toolbar-save.component';
import { EditorToolbarSearchComponent } from './editor-toolbar-container/editor-toolbar-search/editor-toolbar-search.component';
import { AutocompleteInputComponent } from './autocomplete-input';

@NgModule({
  declarations: [
    ...SHARED_PIPES,
    AppComponent,
    MultiEditorComponent,
    ActionTemplateComponent,
    ActionsComponent,
    AutocompleteInputComponent,
    DiffViewComponent,
    AddActionComponent,
    DeleteActionComponent,
    UpdateActionComponent,
    ConditionsComponent,
    EditorToolbarContainerComponent,
    EditorToolbarSaveComponent,
    EditorToolbarSearchComponent,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    JsonEditorModule,
    TypeaheadModule.forRoot()
  ],
  providers: SHARED_SERVICES,
  bootstrap: [AppComponent]
})
export class AppModule { }
