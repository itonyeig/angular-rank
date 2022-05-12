import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, from, Observable, of } from 'rxjs';
import { Contributor, CacheStrorage } from './interface/contributors';
import {
  catchError,
  tap,
  map,
  concatMap,
  mergeMap,
  skipWhile,
  toArray,
  groupBy,
  reduce,
  retry,
  delay,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GitHupService {
  totalLength: number;
  constructor(private http: HttpClient) {}

  generateTotal(link: string, data?): number {
    // console.log(link.split(';'));

    try {
      return +link.split(';')[1].match(/page=(\d+).*$/)[1];
    } catch (error) {
      // console.log('debugger ', link);
      // console.log(data);

      // console.trace();
      // debugger;

      return 1;
    }
  }

  getTotalCount(repoName): Observable<number> {
    return this.http
      .get(
        `https://api.github.com/repos/angular/${repoName}/contributors?page=1&per_page=1`,
        {
          observe: 'response',
          headers: new HttpHeaders({
            Authorization: 'token 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',
          }),
        }
      )
      .pipe(
        map((data) => {
          const totalCount = this.generateTotal(data.headers.get('LINK'));
          this.totalLength = totalCount;
          return totalCount;
        })
      );
  }

  getUserBio(url) {
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: 'token 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',
      }),
    });
  }

  angularRankData() {
    // const contributors = JSON.parse(localStorage.getItem('contributors'));
    const contributors = this.getWithExpiry('contributors');
    if (contributors) {
      return of(contributors);
    }

    return this.http
      .get(`https://api.github.com/orgs/angular/repos?page=1&per_page=100`, {
        observe: 'response',
        headers: new HttpHeaders({
          Authorization: 'token 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',
        }),
      })
      .pipe(
        map((data) => this.getAllPages(data)),
        concatMap((pages) => from(pages.total)),
        mergeMap((page) => this.getAllRepos(page)),
        tap((result) => console.log('All Angular Repositories ', result)),
        concatMap((data) => from(data)),
        mergeMap((data: any) => this.getAllContributors(data.name)),
        concatMap((data) => from(data)),
        groupBy((data: any) => data.name),
        mergeMap((group) =>
          group.pipe(
            reduce((acc, curr) => {
              acc.repoNames = [...acc.repoNames, curr.repoName];

              acc.contributions = acc.contributions + curr.contributions;
              return acc;
            }),
            // get bio
            mergeMap(
              (user) =>
                this.getUserBio(user.userUrl).pipe(
                  delay(2000),
                  map((userBio: any) => ({
                    ...user,
                    gists: userBio.public_gists,
                    followers: userBio.followers,
                    public_repos: userBio.public_repos,
                    fullName: userBio.name,
                    bio: userBio.bio,
                  })),
                  retry(2) //api calls seems to crash on chrome, this helps with that
                ),
              2
            )
          )
        ),
        toArray(),
        tap((result) => console.log('A contributors ', result)),
        tap((result) =>
          this.localStorageWithExpiry('contributors', result, 8640000)
        ),

        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }

  getAllRepos(page): Observable<number[]> {
    return this.http.get<number[]>(
      `https://api.github.com/orgs/angular/repos?page=${page}&per_page=100`,
      {
        headers: new HttpHeaders({
          Authorization: 'token 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',
        }),
      }
    );
  }

  getAllContributors(repoName): Observable<any> {
    return this.getAllContributorPages(repoName).pipe(
      concatMap((pages) => from(pages.total)),
      mergeMap((pageNumber) =>
        this.http
          .get(
            `https://api.github.com/repos/angular/${repoName}/contributors?page=${pageNumber}&per_page=100`,
            {
              headers: new HttpHeaders({
                Authorization: 'token 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',
              }),
            }
          )
          .pipe(skipWhile((data: any[]) => data.length === 0))
      ),
      map((data) =>
        data.map((contributor) => ({
          id: contributor.id,
          name: contributor.login,
          avatar_url: contributor.avatar_url,
          repoName: repoName,
          repoNames: [],
          contributions: contributor.contributions,
          userUrl: contributor.url,
        }))
      ),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
      // tap((data) => console.log('repo and contributors ', data))
    );
  }

  getRepoPageDetails(repoName: string, pageNumber?: string): Observable<any[]> {
    // );
    if (pageNumber) {
      return this.http
        .get<any[]>(
          `https://api.github.com/repos/angular/${repoName}/contributors?page=${pageNumber}&per_page=30`,
          {
            headers: new HttpHeaders({
              Authorization: 'token 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',
            }),
          }
        )
        .pipe(skipWhile((data) => data.length === 0));
    } else {
      return this.http.get<any[]>(
        `https://api.github.com/repos/angular/${repoName}/contributors?page=1&per_page=30`,
        {
          headers: new HttpHeaders({
            Authorization: 'token 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',
          }),
        }
      );
    }
  }

  getAllContributorPages(name) {
    return this.http
      .get(`https://api.github.com/repos/angular/${name}/contributors`, {
        observe: 'response',
        headers: new HttpHeaders({
          Authorization: 'token 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',
        }),
      })
      .pipe(map((data) => this.getAllPages(data)));
  }

  getAllPages(data) {
    const totalCount = this.generateTotal(data.headers.get('LINK'), data);
    const totalPagesArray = [];

    for (let index = 1; index <= totalCount; index++) {
      totalPagesArray.push(index);
    }
    return {
      total: totalPagesArray,
    };
  }

  /**
   * Due to the requirnments of sorting all contributors, client needs
   * all the data at once as server does provide for sorting
   * (at least the endpoint i found does not cater for thos)
   * To combat this, hundreds of api calls need to placed at once
   * This is a very resources intensive task and for that reason, the data received will be cached to the brower
   * with an expiration date
   * @param key localStorage key
   * @param value item to be cached
   * @param ttl time for the item to live
   */
  localStorageWithExpiry(key: string, value: Contributor[], ttl: number) {
    const now = new Date();
    // `item` is an object which contains the value t0 be cached
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * Here we are expiring the item “lazily” - which is to say we check the expiry
   * condition only when we want to retrieve it from storage
   * @param key localStorage key
   * @returns cached item if it is beining retrieved with the time to live range
   */
  getWithExpiry(key: string) {
    const itemStr: string = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item: CacheStrorage = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
}
