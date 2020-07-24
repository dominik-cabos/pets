import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorsService } from '../services/errors.service';
import { LoginService } from '../modules/users';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private errors: ErrorsService,
    private loginService: LoginService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const loggedUser = this.loginService.loggedUserValue;

    if (loggedUser && loggedUser.session) {
      request = request.clone({
        setHeaders: {
          Authorization: loggedUser.session,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.errors.httpError(error);
          return EMPTY;
        } else {
          return throwError(error);
        }
      })
    );
  }
}
