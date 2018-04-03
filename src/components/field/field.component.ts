import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

// TODO: Refactor currency and date fields to subcomponents, move logic
// TODO: Figure out why default properties set above constructor are being ignored/deleted and have to be set inside the constructor
@Component({
  selector: 'app-field-component',
  templateUrl: './field.component.html'
})
export class FieldComponent implements OnInit, OnDestroy {

  @Input() frmGroup: FormGroup;
  @Input() frmControl: string; // Object property of reactive form
  @Input() label: string; // Label for the user to read
  @Input() labelColumns = 3; // The number of bootstrap columns to set the label column, IE 1-12. The field column will be automatically adjusted
  @Input() type = 'text'; // The type of field, default is text
  @Input() placeholder = ''; // Placeholder property
  @Input() classes = ''; // Placeholder property
  @Input() disabled = false; // Disabled or not
  @Input() model?: any; // Model data for a select box
  @Input() modelLabel?: string; // If a model is supplied, this is the label to use
  @Input() modelValue?: string; // If a model is supplied, this is the value of the option to pass back to the form
  @Input() inline?: boolean; // If yes, only show the field in a single column. Hide the label in the left column
  public field: AbstractControl; // Hold a reference to the current field element, this is set in ngoninit
  public showPwd = false; // password toggler for password field
  public altFormat: string | number = ''; // An alternate version of the field data that is formatted differently. IE currency or date
  /** Generates a random number for this field component which ensures a unique label name */
  public randNum = Math.floor(Math.random() * 1000000);
  public typeahead = ''; // Holds typehead model
  private frmGroupSub: Subscription; // If this field elements needs to subscribe to form changes
  /** Observable that powers the typehead*/
  public typeaheadSearch = (text$: any) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term: any) => term.length < 2 ? []
        : this.model.filter((v: any) => {
          const filterMe = this.modelLabel ? v[this.modelLabel] : v;
          return filterMe.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }).slice(0, 10));
  // Formats the output of the typeahead
  public formatter = (x: { key: string }) => {
    // If a complete model was passed in, the display value will be different than the form value
    if (this.model && this.modelValue && this.modelLabel) {
      const item = this.model.filter((elem: any) => elem[this.modelValue] === x);
      // Make sure a result was returned
      if (item && item[0] && item[0][this.modelLabel]) {
        // Get the display value
        return item[0][this.modelLabel];
      } else {
        // Otherwise return normal value
        return x[this.modelLabel] || x;
      }
    }
    // Otherwise return normal value
    return x[this.modelLabel] || x;
  };

  

  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {

  }

  ngOnInit() {

    this.field = this.frmGroup.get(this.frmControl); //Set a reference to this field for simplicity

    // Since the visible currency field is a mask and not connected to the main formgroup, it needs to know when the form model changes
    // This also handles loading the initial value
    if (this.type === 'currency') {
      if (this.field.value && this.field.value !== '') { // On initial load
        this.altFormat = this.currencyPipe.transform(this.field.value, 'USD', true, '1.0');
      }
      this.frmGroupSub = this.frmGroup.valueChanges.subscribe(() => { // If the form is updated dynamically after load
        if (this.field.value && this.field.value !== '') {
          this.altFormat = this.currencyPipe.transform(this.field.value, 'USD', true, '1.0');
        }
      });
    }

    if (this.type === 'date') {
      if (this.field.value && this.field.value !== '') { // On initial load
        this.altFormat = this.datePipe.transform(this.field.value, 'MM/dd/yyyy');
      }
      this.frmGroupSub = this.frmGroup.valueChanges.subscribe(() => { // If the form is updated dynamically after load
        if (this.field.value && this.field.value !== '') {
          this.altFormat = this.datePipe.transform(this.field.value, 'MM/dd/yyyy');
        }
      });
    }
  }

  ngOnDestroy() {
    // Unsub
    if (this.frmGroupSub) {
      this.frmGroupSub.unsubscribe();
    }
  }

  checkboxMap() {
    // console.log('Changing', $event, this.model);
  }

  /**
   * Format a currency input to be nicely formatted but return a standard number to the form mdoel
   * @param $event - Dom event
   */
  onCurrencyChange($event: any) {
    let dollars, cents, hasDecimal, newVal;
    const amount = $event.target.value.replace(/[^0-9.]/gi, '') || '0';
    // If a decimal is present, split the string so that the currencyPipe will format only the dollar amount not the cents
    if (amount.indexOf('.') !== -1) {
      cents = amount.split('.')[1].substring(0, 2);
      hasDecimal = true;
    }
    dollars = amount.split('.')[0];
    newVal = this.currencyPipe.transform(dollars, 'USD', true, '1.0');
    // Rejoin the dollars, decimal and cents
    newVal += hasDecimal ? '.' : '';
    newVal += cents ? cents : '';
    // Update the fiels
    $event.target.value = newVal;
    this.field.setValue(newVal.replace(/[^0-9.]/gi, ''));
  } // end onCurrencyChange

  /**
   * On date change, format it to how that model needs it
   * @param $event - Dom event
   * TODO: Figure out a way to have the user viewable version match the newly formatted version
   */
  onDateChange(altFormat: any) {
    const newDate = `${altFormat.month}/${altFormat.day}/${altFormat.year}`; // Reformat the date
    this.altFormat = newDate;
    this.field.setValue(newDate); // Set form value to the new format
  } // onDateChange

  /**
   * On a typeahead that allows multiple selection, this add the current selection to the array
   */
  public typeaheadAdd(): void {
    this.field.setValue([this.typeahead, ...this.field.value]);
    this.typeahead = '';
  }

  /**
   * For typeaheads that have a companion select dropdown, update the main typeahead on selection
   * @param event
   */
  public updateTypeahead(event: any) {
    this.field.setValue(event.target.value);
  }

  /**
   * Remove an element from a typeahead array
   * @param index - index of the element in the array
   */
  public typeaheadRemove(index: number): void {
    this.field.value.splice(index, 1);
    console.warn(this.field.value);
    this.field.setValue([...this.field.value]);
  }

}
