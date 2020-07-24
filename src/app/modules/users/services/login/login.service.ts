import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../..';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const USER_API_BASE_URL = new InjectionToken<string>(
  'USER_API_BASE_URL'
);
export const USER_API_STORAGE_KEY = 'loggedUser';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    @Inject(USER_API_BASE_URL) private baseUrl: string,
    private http: HttpClient
  ) {
    this.loggedUser = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(USER_API_STORAGE_KEY))
    );
  }

  private loggedUser: BehaviorSubject<User>;

  public getLoggedUser(): Observable<User> {
    return this.loggedUser.asObservable();
  }

  public get loggedUserValue(): User {
    return this.loggedUser.value;
  }

  authenticate(user: User): Observable<any> {
    const userParams = { ...user };
    return this.http
      .get<User>(this.baseUrl + `user/login`, {
        params: userParams,
      })
      .pipe(
        tap((response) => {
          userParams.session = response.message.substr(
            response.message.indexOf(':') + 1
          );
          delete userParams.password;
          localStorage.setItem(
            USER_API_STORAGE_KEY,
            JSON.stringify(userParams)
          );
          this.loggedUser.next(userParams);
        })
      );
  }

  logout(): void {
    this.http.get<User>(this.baseUrl + `user/logout`).subscribe(() => {
      localStorage.removeItem(USER_API_STORAGE_KEY);
      this.loggedUser.next(null);
    });
  }
}
