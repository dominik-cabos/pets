import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorsService} from '../services/errors.service';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private errors: ErrorsService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          if (error.status !== 404) {
            this.errors.httpError(error);
            return EMPTY;
          }
          else {
            return throwError(error);
          }
        })
      );
  }
}
