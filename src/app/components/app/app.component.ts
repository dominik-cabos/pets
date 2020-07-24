import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ErrorsService } from '../../services/errors.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService, User } from '../../modules/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Pets Demo';

  constructor(
    private errors: ErrorsService,
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  loggedUser$: Observable<User>;

  @ViewChild('drawer') drawer;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.errors.getErrors().subscribe((e) => {
      this.handleError(e);
    });

    this.loggedUser$ = this.loginService.getLoggedUser().pipe(
      tap((user) => {
        this.router.navigate(user ? ['/'] : ['/login']);
      })
    );
  }

  private handleError(e): void {
    this.snackbar.open(e, null, {
      verticalPosition: 'top',
      panelClass: 'snackbar-error',
      duration: 5000,
    });
  }

  logout(): void {
    this.loginService.logout();
  }
}
