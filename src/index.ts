import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap

import { FieldComponent } from './components/field/field.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export * from './components/field/field.component';
export * from './components/file-upload/file-upload.component';

@NgModule({
  imports: [
	  CommonModule,
	  FormsModule, ReactiveFormsModule, NgbModule.forRoot()
  ],
  declarations: [
	  FieldComponent,
	  FileUploadComponent
  ],
  exports: [
	  FieldComponent,
	  FileUploadComponent//,
	  //FormsModule, ReactiveFormsModule, NgbModule
  ]
})
export class FormToolsModule {
  static forRoot(): ModuleWithProviders {
    return {
		ngModule: FormToolsModule,
		providers: []//DatePipe, CurrencyPipe
    };
  }
}

export interface FileUpload {
	formData: FormData;
	event: Event;
	filesInfo: {
		ext: string;
		fileRef: File;
		name: string;
		size: number;
		type: string;
	}[];
}