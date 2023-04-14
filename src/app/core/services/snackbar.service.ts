import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTheme } from '../../shared/models/snackbar.model';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, theme: SnackBarTheme) {
    this._snackBar.open(message, 'Cerrar', {
      panelClass: theme
    });
  }
}
