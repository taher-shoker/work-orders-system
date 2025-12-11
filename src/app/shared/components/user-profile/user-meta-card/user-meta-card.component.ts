import { Component, OnInit } from "@angular/core";
import { InputFieldComponent } from "./../../form/input/input-field.component";
import { ModalService } from "../../../services/modal.service";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../../ui/modal/modal.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { SharedUiModule } from "../../shared-ui.module";
import { AuthService } from "../../../services";

@Component({
  selector: "app-user-meta-card",
  imports: [CommonModule, SharedUiModule, ModalComponent, ButtonComponent],
  templateUrl: "./user-meta-card.component.html",
  styles: ``,
})
export class UserMetaCardComponent implements OnInit {
  name: any;
  email: any;
  role: any;
  department: any;
  phone: any;
  constructor(public modal: ModalService, public authService: AuthService) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.name = user.name;
        this.email = user.email;
        this.role = user.title.id;
        this.phone = user.mobile;
        this.department = user.department.name;
      }
    });
  }
  getLabel(statusId: number): string {
    const statusLabels: Record<number, string> = {
      1: "admin",
      2: "engineer",
      3: "technicianer",
    };

    return statusLabels[statusId] || "status.unknown";
  }
  isOpen = false;
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }

  // Example user data (could be made dynamic)
  user = {
    firstName: "Musharof",
    lastName: "Chowdhury",
    role: "Team Manager",
    location: "Arizona, United States",
    avatar: " /assets/images/user/owner.jpg",
    social: {
      facebook: "https://www.facebook.com/PimjoHQ",
      x: "https://x.com/PimjoHQ",
      linkedin: "https://www.linkedin.com/company/pimjo",
      instagram: "https://instagram.com/PimjoHQ",
    },
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
  };

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
