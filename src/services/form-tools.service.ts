import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

//interface ErrorModel {
//  [key: string]: true;
//}

@Injectable()
export class FormToolsService {
  constructor(private fb: FormBuilder) {}

  /**
   * Checks the object to see if it has at least one valid property of a set. Useful for making sure at least one property of a set has a value
   * Use with formGroup.setErrors(errors) to update the form error model
   * @param formValues - An object
   * @param validationModel - The validation model
   * @param prop - If the value is in a nested object, look at this property instead
   */
  public hasOneValidProp(formValues: any, validationModel: { [key: string]: string[] }, prop?: string) {
    // console.log('hasOneValidProp', formValues, validationModel, prop);
    const errors: { [key: string]: boolean } = {};
    // Loop through all elements
    Object.keys(validationModel).forEach(key => {
      const elem: string[] = validationModel[key];

      let hasAtLeastOne = false;
      // Loop through each prop in the element
      elem.forEach(item => {
        // If a value is present, set to true. If prop is passed, check prop instead
        if ((!prop && formValues[item]) || (prop && formValues[item][prop])) {
          hasAtLeastOne = true;
        }
      });
      // If no element found, add to error
      if (hasAtLeastOne === false) {
        errors[key] = true;
      }
    });

    // If errors are found, return errors object. Otherwise return false
    if (errors && Object.keys(errors).length) {
      return errors;
    } else {
      return false;
    }
  }

  /**
   * Automatically generate a form group complete with controls. Will recurse through nested objects/arrays.
   * @param model - An object or JSON of the model. Can contain nested objects and arrays
   * @param defaultRequired - Should all fields be required. Default is false
   */
  public createFormGroup(model: any, defaultRequired = false): FormGroup {
    // console.log(this.fb, defaultRequired)
    const formModel: any = {};
    // Loop through all props in the model
    Object.keys(model).forEach(key => {
      // If this is a nested object, recurse to create form group
      if (model[key] && typeof model[key] === 'object' && !Array.isArray(model[key])) {
        formModel[key] = this.createFormGroup(model[key]);
      } else if (model[key] && typeof model[key] === 'object' && Array.isArray(model[key])) {
        // If this is an array, recurse to create a form array
        const formArray: any[] = [];
        model[key].forEach((item: any) => formArray.push(this.createFormGroup(item)));
        formModel[key] = this.fb.array(formArray);
      } else {
        // Standard value
        formModel[key] = defaultRequired ? [null, [Validators.required]] : [null, []];
      }
    });

    return this.fb.group(formModel);
  }
}
