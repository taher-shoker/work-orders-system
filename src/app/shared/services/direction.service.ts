import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DirectionService {
  private isRTL = true; // 🔥 Default RTL (Arabic)
  private initialized = false;
  private currentLanguageSubject = new BehaviorSubject<string>("ar");
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public translate: TranslateService
  ) {}

  initDirection() {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;
    this.initialized = true;

    const savedDir = localStorage.getItem("app-direction");
    const savedLang =
      localStorage.getItem("app-lang") || localStorage.getItem("lang");

    const lang = savedLang === "en" ? "en" : "ar";
    this.isRTL = savedDir ? savedDir === "rtl" : lang !== "en";

    this.setLanguage(lang, false);
    this.preloadOtherLanguage(lang);
  }

  toggle() {
    const nextLang = this.currentLanguageSubject.value === "ar" ? "en" : "ar";
    this.setLanguage(nextLang);
  }

  setLanguage(lang: string, persist = true): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const normalizedLang = lang === "en" ? "en" : "ar";
    this.isRTL = normalizedLang !== "en";

    if (persist) {
      localStorage.setItem("app-direction", this.isRTL ? "rtl" : "ltr");
      localStorage.setItem("app-lang", normalizedLang);
      localStorage.setItem("lang", normalizedLang);
    }

    this.applyDirection(this.isRTL, normalizedLang);
    this.applyLang(normalizedLang);
    this.currentLanguageSubject.next(normalizedLang);
  }

  private applyDirection(isRTL: boolean, lang: string): void {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.body.classList.toggle("rtl-layout", isRTL);
    document.body.classList.toggle("ltr-layout", !isRTL);
  }

  applyLang(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  private preloadOtherLanguage(currentLang: string): void {
    const otherLang = currentLang === "ar" ? "en" : "ar";
    this.translate.getTranslation(otherLang).subscribe({
      error: () => {},
    });
  }

  isRTLMode(): boolean {
    return this.isRTL;
  }
}
