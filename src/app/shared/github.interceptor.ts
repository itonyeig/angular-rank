import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GithubInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request.clone({
      setHeaders: {
        Authorization: 'token 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',
      },
    });
    console.log('hello ', request);

    return next.handle(request);
  }
}
