import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnInit,
  Optional,
  Self,
  forwardRef,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

export interface Option {
  [key: string]: any;
}

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  imports: [CommonModule, TranslateModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: Option[] = [];
  @Input() placeholder: string = "";
  @Input() valueName: keyof Option = "id";
  @Input() labelName: keyof Option = "name";
  @Input() disabled = false;
  @Input() className = "";

  // Internal selected object
  selectedOption: Option | null = null;
  control!: FormControl;
  value: any;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (!this.placeholder) {
      this.translate
        .get("forms.select")
        .subscribe((res) => (this.placeholder = res));
    }
  }

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  handleChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null; // do not validate manually; let Angular handle it
  }
  // Classes based on FormControl state
  get inputClasses(): string {
    const hasError = this.control?.touched && this.control?.errors;

    let classes = `
      h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm
      shadow-theme-xs placeholder:text-gray-400
      focus:outline-hidden focus:ring-3
      dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30
      ${this.className || ""}
    `;

    if (this.disabled) {
      classes += `
        text-gray-500 border-gray-300 opacity-40 bg-gray-100
        dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
      `;
    } else if (hasError) {
      classes += `
        !border-error-500 !focus:border-error-300 !focus:ring-error-500/20
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
