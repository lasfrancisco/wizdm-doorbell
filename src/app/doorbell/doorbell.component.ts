import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DoorbellService } from './doorbell.service';

@Component({
  selector: 'wm-doorbell',
  templateUrl: './doorbell.component.html',
  styleUrls: ['./doorbell.component.scss']
})
export class DoorbellComponent {

  @ViewChild('formTemplate', { static: true }) 
  private template: TemplateRef<DoorbellComponent>;
  
  readonly form: FormGroup;
  public files: FileList;
  public sending = false;

  constructor(private builder: FormBuilder, private dialog: MatDialog, private doorbell: DoorbellService) { 

    this.form = builder.group({
      'name': ['', Validators.required ],
      'email': ['', [ Validators.required, Validators.email ]],
      'message': ['', Validators.required ]
    });
  }

  @Input() attachments = false;

  public open() {

    const ref = this.dialog.open(this.template, {  disableClose: true });

    ref.afterOpened().subscribe( () => 
      this.doorbell.ring().then( success => this.rang.emit(success) ) 
    );

    ref.afterClosed().subscribe( () => this.form.reset() );
  }

  @Output() rang = new EventEmitter<boolean>();

  public send() {

    this.sending = true;

    this.doorbell.submit({ language: 'en', ...this.form.value }, this.files)
      .then( success => {

        this.sending = false;
        
        this.sent.emit(success);

        this.dialog.closeAll();
      
      });
  }

  @Output() sent = new EventEmitter<boolean>();
}