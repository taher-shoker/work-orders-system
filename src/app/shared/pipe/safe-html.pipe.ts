import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SecurityContext } from "@angular/platform-browser";

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): string {
    if (!value) {
      return "";
    }

    return this.sanitizer.sanitize(SecurityContext.HTML, value) || "";
  }
}