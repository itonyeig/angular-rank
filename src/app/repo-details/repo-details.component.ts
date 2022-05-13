import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, EMPTY, merge, Observable, Subscription } from 'rxjs';
import { GitHupService } from '../shared/git-hup.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  bufferCount,
  catchError,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss'],
})
export class RepoDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  resultLength: number;
  repoName = this.route.snapshot.paramMap.get('name');
  repoDetails$: Observable<any>;
  resultLength$: Observable<number>;
  sub: Subscription;
  imageWidth = 50;
  imageMargin = 2;
  isLoading = true;

  constructor(
    private gitHubService: GitHupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resultLength$ = this.gitHubService.getTotalCount(this.repoName).pipe(
      map((result) => {
        this.resultLength = result;
        return this.resultLength;
      }),
      tap(console.log)
    );
  }

  ngAfterViewInit(): void {
    // this.paginator.page.subscribe((event: PageEvent) => {
    //   console.log(event);
    // });

    this.sub = merge(this.paginator.page)
      .pipe(
        // server side pagination
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          const pageNumber = (this.paginator.pageIndex + 1).toString();
          this.repoDetails$ = combineLatest([
            this.gitHubService.getRepoPageDetails(this.repoName, pageNumber),
            this.route.paramMap,
          ]).pipe(
            map(([repodetails, params]) => {
              this.repoName = params.get('name');
              this.isLoading = false;
              return repodetails;
            }),
            catchError((error) => {
              console.log(error);
              alert('error occured');
              this.isLoading = false;
              return EMPTY;
            })
          );
          return this.repoDetails$;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  trackById(index: number, contributor: any): number {
    return contributor.id;
  }
}
