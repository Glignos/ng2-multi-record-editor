import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MultiEditorComponent } from './multi-editor';
import { ReadMoreComponent } from './read-more';
import { SHARED_SERVICES } from './shared';
import { AlertModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToggleTextPipe } from './shared/pipes/toggle-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MultiEditorComponent,
    ReadMoreComponent,
    ToggleTextPipe,
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
