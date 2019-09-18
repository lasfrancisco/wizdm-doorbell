import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DoorbellComponent } from './doorbell.component';
import { DoorbellService, DoorbellConfig, DoorbellConfigToken } from './doorbell.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  declarations: [
    DoorbellComponent
  ],
  exports: [
    DoorbellComponent
  ],
  entryComponents: [
    DoorbellComponent
  ],
  providers: [DoorbellService]
})
export class DoorbellModule { 

  static init(config: DoorbellConfig) {
    return {
      ngModule: DoorbellModule,
      providers: [
        { provide: DoorbellConfigToken, useValue: config }
      ]
    }
  }
}