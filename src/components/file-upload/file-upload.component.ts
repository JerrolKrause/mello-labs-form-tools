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
		// Get file properties
		let fileInfo = this.getFilesProps(this.files);

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
		let fileData: any[] = [];

		for (let file of files) {
			// Get extension
			let ext = file.name.split('.');
			ext = ext[ext.length - 1].toLowerCase();
			let data = {
				name: file.name,
				size: file.size,
				type: file.type,
				ext: ext,
				fileRef : file
			}
			fileData.push(data);
		}

		return fileData;
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
