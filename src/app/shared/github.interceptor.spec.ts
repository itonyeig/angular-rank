import { TestBed } from '@angular/core/testing';

import { GithubInterceptor } from './github.interceptor';

describe('GithubInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GithubInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GithubInterceptor = TestBed.inject(GithubInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
