import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  constructor() {}

  private errors$ = new Subject<string>();

  httpError(error: HttpErrorResponse): void {
    this.errors$.next('Your request couldn\'t be completed. Please try again later.');
    this.log(error);
  }

  public getErrors(): Observable<string> {
    return this.errors$.asObservable();
  }

  log(error): void {
    // todo
  }
}
