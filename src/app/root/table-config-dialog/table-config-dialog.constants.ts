import { ValidatorFn, Validators } from "@angular/forms";

export const NUMBER_FORM_FIELD_VALIDATORS: ValidatorFn[] = [
  Validators.required,
  Validators.min(1),
  Validators.max(100),
];

export const SUBMISSION_DELAY: number = 1000;
