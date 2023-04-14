import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { AuthService } from '../../modules/auth/auth.service';
import { Observable, tap } from 'rxjs';
import { Jwt } from '../../shared/models/auth/jwt.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    req = req.clone({
      withCredentials: true
    });
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const tokenHeader = event.headers.get('new-token');
          if (tokenHeader) {
            const tokenInfo: Jwt = JSON.parse(tokenHeader);
            this.authService.saveToken(tokenInfo);
          }
        }
      })
    );
  }
}
