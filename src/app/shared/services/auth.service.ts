import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();
  title: any;
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  constructor(
    private _HttpClient: HttpClient,
    private cookieService: CookieService,
    private _ToastrService: ToastrService,
    private translate: TranslateService,
  ) {
    if (this.hasValidToken()) {
      this.restoreUserFromCookie();
      //this.refreshCurrentUser();
    } else {
      this.clearStoredAuth();
    }
  }

  /** 🔹 Load user from cookie if exists */
  private restoreUserFromCookie(): void {
    try {
      const userStr =
        localStorage.getItem(this.userKey) ||
        this.cookieService.get(this.userKey);
      if (userStr) {
        const user: IUser = JSON.parse(userStr);
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
    }
  }

  private refreshCurrentUser(): void {
    this._HttpClient.get<{ data: IUser }>('auth/get_single_user').subscribe({
      next: (res) => {
        if (res?.data) {
          localStorage.setItem(this.userKey, JSON.stringify(res.data));
          this.userSubject.next(res.data);
        }
      },
      error: () => {
        this.clearStoredAuth();
      },
    });
  }

  /** 🔹 Get current user */
  get user(): IUser | null {
    return this.userSubject.value;
  }

  /** 🔹 Login */
  onLogin(data: any): Observable<any> {
    return this._HttpClient.post('auth/login', data).pipe(
      tap((res: any) => {
        if (res?.data?.token) {
          // Keep auth data in localStorage as a frontend fallback.
          // For stronger protection, backend-issued HttpOnly cookies are recommended.
          localStorage.setItem(this.tokenKey, res.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.data));

          // Update observable user
          this.userSubject.next(res.data);
        }
        if (res.status_code === 401) {
          this._ToastrService.error(
            this.translate.instant('login.failed_login'),
          );
        }
      }),
    );
  }

  /** 🔹 Logout */
  logout(): void {
    this.clearStoredAuth();
    this.userSubject.next(null);
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.cookieService.delete(this.tokenKey);
    this.cookieService.delete(this.userKey);
  }
  onRegister(data: any): Observable<any> {
    return this._HttpClient.post('auth/register', data);
  }

  /** 🔹 Role Checks */
  // These checks control UI visibility only; backend APIs must enforce authorization.
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
    return this.hasValidToken();
  }

  getAccessToken(): string {
    return (
      localStorage.getItem(this.tokenKey) ||
      this.cookieService.get(this.tokenKey)
    );
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload?.exp) {
        return true;
      }
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // getProfile() {
  //   localStorage.getItem('title');
  //   this.getRole();
  // }
}
