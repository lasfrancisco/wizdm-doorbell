import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DoorbellModule } from './doorbell/doorbell.module';
import { AppComponent } from './app.component';

@NgModule({
  imports:      [   
    BrowserModule, 
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    DoorbellModule.init({
      url : 'https://doorbell.io/api/applications',
      id  : 'Your id here',
      key : 'Your secret key here'
    })
  ],
  
  declarations: [ 
    AppComponent
  ],

  providers: [
  ],
  
  bootstrap: [ AppComponent ]
})
export class AppModule { }
