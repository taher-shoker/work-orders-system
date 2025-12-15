import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface IUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  title: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  is_active: number;
  account_type: number;
  image: string;
  token: string;
  roles: IUserRoles;
}

export interface IUserRoles {
  add_users: boolean;
  edit_users: boolean;
  delete_users: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();
  title: any;

  constructor(
    private _HttpClient: HttpClient,
    private cookieService: CookieService,
    private _ToastrService: ToastrService,
    private translate: TranslateService
  ) {
    this.restoreUserFromCookie();
  }

  /** 🔹 Load user from cookie if exists */
  private restoreUserFromCookie(): void {
    try {
      const userStr = this.cookieService.get("user");
      if (userStr) {
        const user: IUser = JSON.parse(userStr);
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
    }
  }

  /** 🔹 Get current user */
  get user(): IUser | null {
    return this.userSubject.value;
  }

  /** 🔹 Login */
  onLogin(data: any): Observable<any> {
    return this._HttpClient.post("auth/login", data).pipe(
      tap((res: any) => {
        if (res?.data?.token) {
          // Save token
          this.cookieService.set("token", res.data.token, 7);

          // Save user
          this.cookieService.set("user", JSON.stringify(res.data), 7);

          // Update observable user
          this.userSubject.next(res.data);
        }
        if (res.status_code === 401) {
          this._ToastrService.error(
            this.translate.instant("login.failed_login")
          );
        }
      })
    );
  }

  /** 🔹 Logout */
  logout(): void {
    this.cookieService.delete("token");
    this.cookieService.delete("user");
    this.cookieService.deleteAll();

    this.userSubject.next(null);
  }
  onRegister(data: any): Observable<any> {
    return this._HttpClient.post("auth/register", data);
  }

  /** 🔹 Role Checks */
  isAdmin(): boolean {
    return this.user?.title?.id === 1;
  }

  isEngineer(): boolean {
    return this.user?.title?.id === 2;
  }

  isTechnician(): boolean {
    return this.user?.title?.id === 3;
  }

  /** 🔹 Check if user is authenticated */
  isAuthorizedUser(): boolean {
    return !!this.cookieService.get("token");
  }

  // getProfile() {
  //   localStorage.getItem('title');
  //   this.getRole();
  // }
}
