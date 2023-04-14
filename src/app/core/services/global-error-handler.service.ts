import { ErrorHandler, Injectable } from '@angular/core';
import { SnackBarService } from './snackbar.service';
import { SnackBarTheme } from '../../shared/models/snackbar.model';
import { HttpErrorResponse } from '@angular/common/http';
import { translateHttpMessage } from '../helper/translator.helper';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private snackBarService: SnackBarService) {}

  handleError(error: HttpErrorResponse): void {
    console.error(error);
    let message: string;
    if (error.error) {
      message = translateHttpMessage(error.error.message);
    } else {
      message = error.message;
    }
    this.snackBarService.openSnackBar(message, SnackBarTheme.Error);
  }
}
