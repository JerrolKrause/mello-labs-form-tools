import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
/**
 * <file-upload #fileUpload [frmGroup]="formMain" frmControl="files" label="Upload Files" [multiple]="true" [dragNdrop]="true" (filesAdded)="filesAdded($event)"></file-upload>
 */
@Component({
	selector: 'file-upload',
	styles: [`
        .fill .col{position:initial!important;}
        .fill .dragNDrop{position:absolute;top:0;bottom:0;left:0;right:0;height: 100%;background:none;z-index:5;}
        .fill .dragNdrop-bg{position:absolute;top:5px;bottom:5px;left:5px;right:5px;opacity:0.85;background: #fff;z-index:-1;}
`],
	templateUrl: './file-upload.component.html'
})
export class FileUploadComponent implements OnInit {

	@Input() frmGroup: FormGroup;
	@Input() frmControl: string; // Object property of reactive form
	@Input() label: string; // Label for the user to read
	@Input() classes: string = ''; // Placeholder property
	@Input() disabled: boolean = false; // Disabled or not
	@Input() multiple: boolean = false; // Upload multiple files or not
	@Input() dragNdrop: boolean = false; // Show drag and drop box instead of file upload
	/** Turns on absolute positioning and fills the parent component. Be sure to set position relative on parent. */
	@Input() fillParent: boolean = false;

	@Output() filesAdded: EventEmitter<any> = new EventEmitter();

	public field: AbstractControl; // Hold a reference to the current field element, this is set in ngoninit
	public files: any; // Formdata object for files
	public hover: boolean = false;

	constructor() {
		this.disabled = this.multiple = this.dragNdrop = this.fillParent = false;
		this.filesAdded = new EventEmitter();
	}

	ngOnInit() {
		if (this.frmControl) {
			this.field = this.frmGroup.get(this.frmControl); //Set a reference to this field for simplicity
		}
	}

    /**
     * When files are added
     * @param event
     */
	public onFilesAdded(event: any) {
		this.files = event.srcElement.files;
		let formData: FormData = new FormData();

		for (let i = 0; i < this.files.length; i++) {
			formData.append('files[]', this.files[i], this.files[i].name);
		}
		this.filesAdded.emit({ formData: formData, event: event });
		if (this.fillParent) {
			this.files = null;
		}
	}

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
