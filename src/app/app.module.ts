import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MultiEditorComponent } from './multi-editor';
import { SHARED_SERVICES } from './shared';
import { AlertModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DiffPipePipe } from './shared/pipes/diff-pipe.pipe';
import { ActionTemplateComponent} from './action-template'
import { AdditionTemplateComponent } from './addition-template';
import { ActionsTemplateComponent } from './actions-template/actions-template.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiEditorComponent,
    DiffPipePipe,
    ActionTemplateComponent,
    AdditionTemplateComponent,
    ActionsTemplateComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [
    SHARED_SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
