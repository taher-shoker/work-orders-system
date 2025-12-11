import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class DirectionService {
  private isRTL = true; // 🔥 Default RTL (Arabic)

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public translate: TranslateService
  ) {}

  initDirection() {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedDir = localStorage.getItem("app-direction");
    const savedLang = localStorage.getItem("app-lang");

    if (savedDir) {
      this.isRTL = savedDir === "rtl";
    }

    const lang = savedLang || "ar"; // 🔥 Default to Arabic if nothing saved

    this.applyDirection(this.isRTL);
    this.applyLang(lang);
  }

  toggle() {
    this.isRTL = !this.isRTL;
    const lang = this.isRTL ? "ar" : "en";

    this.applyDirection(this.isRTL);
    localStorage.setItem("app-direction", this.isRTL ? "rtl" : "ltr");
    localStorage.setItem("app-lang", lang);
    this.applyLang(lang);
    window.location.reload();
  }

  private applyDirection(isRTL: boolean): void {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
    document.body.classList.toggle("rtl-layout", isRTL);
    document.body.classList.toggle("ltr-layout", !isRTL);
  }
  applyLang(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
  isRTLMode(): boolean {
    return this.isRTL;
  }
}
