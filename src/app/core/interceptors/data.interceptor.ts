import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method === 'POST' || request.method === 'PUT') {
      const modifiedRequest = request.clone({
        body: { data: request.body }
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
