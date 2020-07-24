import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Pet} from '../..';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export const PET_API_BASE_URL = new InjectionToken<string>('PET_API_BASE_URL');

@Injectable({
  providedIn: 'root',
})

export class PetHttpService {
  constructor(
    @Inject(PET_API_BASE_URL) private baseUrl: string,
    private http: HttpClient
  ) {}

  find(query: string): Observable<Pet> {
    return this.http.get<Pet>(this.baseUrl + `pet/${query}`);
  }

  register(pet: Pet): any  {
    return this.http.post<Pet>(this.baseUrl + `pet`, pet);
  }
}
