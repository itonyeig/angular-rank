import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, from, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contributor } from './interface/contributors';
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
  throttle,
  retry,
  delay,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GitHupService {
  constructor(private http: HttpClient) {}

  getContributors(pageNumber?: string): Observable<Contributor[]> {
    return this.http
      .get(`${environment.githupAPI}?page=${pageNumber}&per_page=30`, {
        observe: 'response',
      })
      .pipe(
        tap((data) => console.log('server response ', data)),
        map((data) => data.body as Contributor[])
      );
  }

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

  getTotalCount(): Observable<number> {
    return this.http
      .get(`${environment.githupAPI}?page=1&per_page=1`, {
        observe: 'response',
        headers: new HttpHeaders({
          Authorization: 'token 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',
        }),
      })
      .pipe(
        map((data) => {
          const totalCount = this.generateTotal(data.headers.get('LINK'));
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
    // if (contributors) {
    //   return of(contributors);
    // }

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
        // tap((result) => console.log('Page Numbers ', result)),
        mergeMap((page) => this.getAllRepos(page)),
        // tap((result) => console.log('All Angular Repositories ', result)),
        // @ts-expect-error
        concatMap((data) => from(data)),
        mergeMap((data) => this.getAllContributors(data.name)),
        // COMMENT FROM HERE
        concatMap((data) => from(data)),
        // @ts-expect-error
        groupBy((data) => data.name),
        // mergeMap((group) => group.pipe(toArray())),
        // delay(1000),
        mergeMap((group) =>
          group.pipe(
            // scan((acc, cur) => {
            //   acc.repoNames.push(cur.repoName);
            //   return acc;
            // }),
            // tap((data) =>
            //   localStorage.setItem('dataWithRepoNames ', JSON.stringify(data))
            // ),
            reduce((acc, curr) => {
              // console.log('accumulator ', acc);
              // console.log('value ', curr);
              // debugger;
              // @ts-expect-error
              acc.repoNames.push(curr.repoName);
              // @ts-expect-error
              acc.contributions = acc.contributions + curr.contributions;
              // acc.repoNames.push(curr.repoName);
              return acc;
            }),
            // get bio
            mergeMap(
              (user) =>
                // @ts-expect-error
                this.getUserBio(user.userUrl).pipe(
                  delay(2000),
                  map((userBio) => ({
                    // @ts-expect-error
                    ...user,
                    // @ts-expect-error
                    gists: userBio.public_gists,
                    // @ts-expect-error
                    followers: userBio.followers,
                    // @ts-expect-error
                    public_repos: userBio.public_repos,
                    // @ts-expect-error
                    fullName: userBio.name,
                    // @ts-expect-error
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
        // tap((result) =>
        //   localStorage.setItem('contributors', JSON.stringify(result))
        // ),

        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }

  getAllRepos(page) {
    return this.http.get(
      `https://api.github.com/orgs/angular/repos?page=${page}&per_page=100`,
      {
        headers: new HttpHeaders({
          Authorization: 'token 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',
        }),
      }
    );
  }

  getAllContributors(repoName) {
    return this.getAllContributorPages(repoName).pipe(
      concatMap((pages) => from(pages.total)),
      // tap((data) => console.log('contributors pages ', data))
      mergeMap((pageNumber) =>
        this.http
          .get(
            `https://api.github.com/repos/angular/${repoName}/contributors?page=${pageNumber}&per_page=100`,
            {
              headers: new HttpHeaders({
                Authorization: 'token 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',
              }),
            }
          ) // @ts-expect-error
          .pipe(skipWhile((data) => data.length === 0))
      ),
      map((data) =>
        // @ts-expect-error
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
    // console.log(data.headers.get('LINK'));

    const totalCount = this.generateTotal(data.headers.get('LINK'), data);
    const totalPagesArray = [];

    for (let index = 1; index <= totalCount; index++) {
      totalPagesArray.push(index);
    }
    // console.log('totalCountArray', totalPagesArray);
    // firstPageResult.push(data.body); // come back to this
    return {
      total: totalPagesArray,
    };
  }
}
