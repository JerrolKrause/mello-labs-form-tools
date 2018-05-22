import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap

// Components
import { FieldComponent } from './components/field/field.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

// Services
import { FormToolsService } from './services/form-tools.service';

// Exports
export * from './components/field/field.component';
export * from './components/file-upload/file-upload.component';
export * from './services/form-tools.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot()],
  declarations: [FieldComponent, FileUploadComponent],
  providers: [FormToolsService],
  exports: [FieldComponent, FileUploadComponent],
})
export class FormToolsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormToolsModule,
      providers: [FormToolsService],
    };
  }
}

export interface FileUpload {
  formData?: FormData;
  event?: Event;
  filesInfo?: {
    ext?: string;
    fileRef?: File;
    name?: string;
    size?: number;
    type?: string;
  }[];
}
