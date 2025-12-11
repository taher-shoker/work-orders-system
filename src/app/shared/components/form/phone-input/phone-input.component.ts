import { CommonModule } from "@angular/common";
import { Component, Input, forwardRef, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  AbstractControl,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

export interface CountryCode {
  code: string; // +966
  label: string; // Saudi Arabia
}

@Component({
  selector: "app-phone-input",
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  templateUrl: "./phone-input.component.html",
  styles: ``,
})
export class PhoneInputComponent
  implements ControlValueAccessor, Validator, OnInit
{
  /** Country list */
  @Input() countries: CountryCode[] = [
    { code: "+966", label: "Saudi Arabia" },
    // { code: "+20", label: "Egypt" },
    // { code: "+971", label: "UAE" },
    // { code: "+1", label: "USA" },
  ];

  @Input() placeholder: string = "5xx xxx xxx";
  @Input() selectPosition: "start" | "end" = "start";

  selectedCountry: string = "+966";
  phoneNumber: string = "";

  /** ControlValueAccessor callbacks */
  onChange = (_: any) => {};
  onTouched = () => {};
  control!: FormControl;
  @Input() className: string = "";
  @Input() disabled: boolean = false;

  ngOnInit() {
    if (this.countries.length > 0) {
      this.selectedCountry = this.countries[0].code;
    }
  }
  // VALIDATION — store control instance
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null; // do not validate manually; let Angular handle it
  }

  /** Write value from FormControl */
  writeValue(value: string): void {
    if (!value) {
      this.phoneNumber = "";
      return;
    }

    // Example: "+966 512 222 111"
    const matchedCountry = this.countries.find((c) => value.startsWith(c.code));

    if (matchedCountry) {
      this.selectedCountry = matchedCountry.code;
      this.phoneNumber = value.replace(matchedCountry.code, "").trim();
    } else {
      this.phoneNumber = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  /** Handlers */
  handleCountryChange(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
    this.emitValue();
  }

  handlePhoneChange(event: Event) {
    this.phoneNumber = (event.target as HTMLInputElement).value;
    this.emitValue();
  }

  private emitValue() {
    const formatted = `${this.selectedCountry} ${this.phoneNumber}`;
    console.log(formatted);
    this.onChange(formatted);
  }
  // Classes based on FormControl state
  get inputClasses(): string {
    const hasError = this.control?.touched && this.control?.errors;

    let classes = `
     
      ${this.className || ""}
    `;

    if (this.disabled) {
      classes += `
        text-gray-500 border-gray-300 opacity-40 bg-gray-100
        dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
      `;
    } else if (hasError) {
      classes += `
        !border-error-500 !focus:border-error-300 !focus:ring-error-500/20 border rounded-lg
      `;
    } else {
      classes += `
        bg-transparent text-gray-800 border-gray-300
        focus:border-brand-300 focus:ring-brand-500/20
        dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800
      `;
    }

    return classes;
  }
}
