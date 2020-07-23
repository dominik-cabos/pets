import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ErrorsService } from '../../services/errors.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  ) {}

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
  }

  private handleError(e): void {
    this.snackbar.open(e, null, {
      verticalPosition: 'top',
      panelClass: 'snackbar-error',
      duration: 5000,
    });
  }
}
