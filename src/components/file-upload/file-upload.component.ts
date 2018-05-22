import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
/**
 * <file-upload #fileUpload [frmGroup]="formMain" frmControl="files" label="Upload Files" [multiple]="true" [fillParent]="true" [dragNdrop]="true" (filesAdded)="filesAdded($event)"></file-upload>
 */

@Component({
  selector: 'app-file-upload',
  styles: [
    `
        .fill .col{position:initial!important;}
        .fill .dragNDrop{position:absolute;top:0;bottom:0;left:0;right:0;height: 100%;background:none;z-index:5;padding-top: 0;background:#fff;}
        .fill .dragNdrop-bg{position:absolute;top:5px;bottom:5px;left:5px;right:5px;opacity:0.85;background: #fff;z-index:-1;}
		.v-center{position: relative;top: 45%;transform: translateY(-50%);}
		small{font-size: 60%;}
`,
  ],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent implements OnInit, AfterViewInit {
  /** Form group reference */
  @Input() frmGroup: FormGroup;
  /** Object property of reactive form */
  @Input() frmControl: string;
  /** Label for the user to read */
  @Input() label: string;
  /** Placeholder property */
  @Input() classes = '';
  /** Disabled or not */
  @Input() disabled = false;
  /** Upload multiple files or not */
  @Input() multiple = false;
  /** Show drag and drop box instead of file upload */
  @Input() dragNdrop = false;
  /** Turns on absolute positioning and fills the parent component. Be sure to set position relative on parent. */
  @Input() fillParent = false;
  /** Upload multiple files or not */
  @Input() text = false;
  /** When a file was added, data is emitted */
  @Output() filesAdded: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileField') fileField: ElementRef;

  public field: AbstractControl; // Hold a reference to the current field element, this is set in ngoninit
  public files: any; // Formdata object for files
  public hover = false;
  public dropFileSize: false | number = false;

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.dropFileSize = this.disabled = this.multiple = this.dragNdrop = this.fillParent = false;
    this.filesAdded = new EventEmitter();
  }

  ngOnInit() {
    if (!this.frmGroup) {
      this.frmGroup = this.fb.group({
        // <-- the parent FormGroup
        files: ['', []],
      });
      this.frmControl = 'files';
    }

    if (this.frmControl) {
      this.field = this.frmGroup.get(this.frmControl); //Set a reference to this field for simplicity
    }
  }

  ngAfterViewInit() {
    if (this.fillParent) {
      this.getDropTextSize();
    }
  }

  /**
   * When files are added
   * @param event
   */
  public onFilesAdded(event: any) {
    this.files = event.srcElement.files;
    const formData: FormData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append('files[]', this.files[i], this.files[i].name);
    }
    // Get file properties
    const fileInfo = this.getFilesProps(this.files);

    this.filesAdded.emit({ formData: formData, event: event, filesInfo: fileInfo });
    if (this.fillParent) {
      this.files = null;
    }
  }

  /**
   * Loop through the file/s added and create a simple to consumer array of the files properties
   * @param files
   */
  public getFilesProps(files: any): any[] {
    const fileData: any[] = [];

    for (const file of files) {
      // Get extension
      let ext = file.name.split('.');
      ext = ext[ext.length - 1].toLowerCase();
      const data = {
        name: file.name,
        size: file.size,
        type: file.type,
        ext: ext,
        fileRef: file,
      };
      fileData.push(data);
    }

    return fileData;
  }

  /**
   * Adjust the size of the drop text based on input box width
   */
  private getDropTextSize() {
    let dropFileSize;
    dropFileSize = Math.round(this.fileField.nativeElement.getBoundingClientRect().width / 700 * 100) / 100;
    if (dropFileSize > 2) {
      dropFileSize = 2;
    }
    if (dropFileSize < 1) {
      dropFileSize = 1;
    }
    this.dropFileSize = dropFileSize;
    this.ref.detectChanges();
  }

  /**
   *  Set hoverstate
   * @param newState
   */
  public updateHover(newState: boolean) {
    this.hover = newState;
  }

  /**
   * Remove files from the upload box
   */
  public deleteFiles() {
    this.hover = false;
    this.files = null;
  }
}
