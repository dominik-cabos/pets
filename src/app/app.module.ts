import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { PetsModule } from './modules/pets/pets.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import {PET_API_BASE_URL} from './modules/pets';
import {environment} from '../environments/environment';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ApiInterceptor} from './http/api.interceptor';

export function PetApiBaseUrlFactory(): string {
  return  environment.petApiBaseUrl + (environment.petApiBaseUrl.endsWith('/') ? '' : '/');
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PetsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [{provide: PET_API_BASE_URL, useFactory: PetApiBaseUrlFactory},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
