import { ValidatorFn, ValidationErrors, FormControl } from "@angular/forms";

export const MIN_FILLED_FIELDS_COUNT = 3;

export const MAX_VALUE_VALIDATOR: (maxValue: number) => ValidatorFn = (maxValue: number) => {
  return (control: FormControl): ValidationErrors | null => {
    return parseInt(control.value, 2) > maxValue
      ? { maxValue: true }
      : null;
  };
}
