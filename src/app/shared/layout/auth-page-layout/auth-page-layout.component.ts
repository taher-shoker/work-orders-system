import { Component } from "@angular/core";
import { GridShapeComponent } from "../../components/common/grid-shape/grid-shape.component";
import { RouterModule } from "@angular/router";
import { ThemeToggleTwoComponent } from "../../components/common/theme-toggle-two/theme-toggle-two.component";
import { SharedUiModule } from "../../components/shared-ui.module";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { LangToggleSelectorComponent } from "../../components/common/lang-toggle-selector/lang-toggle-selector.component";

@Component({
  selector: "app-auth-page-layout",
  imports: [
    RouterModule,
    CommonModule,
    ThemeToggleTwoComponent,
    TranslateModule,
    LangToggleSelectorComponent
],
  templateUrl: "./auth-page-layout.component.html",
})
export class AuthPageLayoutComponent {
  slides = [
    {
      image: "assets/images/login-bg.jpg",
      title: "home.hello",
      text: "home.pannerWelcome",
    },
    {
      image: "assets/images/1.jpeg",
      title: "home.hello",
      text: "home.pannerWelcome",
    },
    {
      image: "assets/images/2.jpeg",
      title: "home.hello",
      text: "home.pannerWelcome",
    },
  ];

  activeIndex = 0;
  intervalId!: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.activeIndex = index;
  }
}
