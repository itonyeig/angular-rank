import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { GitHupService } from '../shared/git-hup.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-angular-contributors',
  templateUrl: './angular-contributors.component.html',
  styleUrls: ['./angular-contributors.component.scss'],
})
export class AngularContributorsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  contributors$: Observable<any>;
  imageWidth = 50;
  imageMargin = 2;
  resultLength: number = 0;
  pageSize: number = 30;
  data;
  contributors;

  constructor(private gitHubService: GitHupService) {}

  ngOnInit(): void {
    // this.gitHubService.angularRankData().subscribe((data) => {
    //   // setTimeout is needed to avoid change detection error
    //   setTimeout(() => {
    //     this.resultLength = data.length;
    //   }, 0);
    //   this.data = data;
    //   this.contributors = this.data.slice(0, this.pageSize);
    // });
  }

  // client side pagination
  onPageChange(event: PageEvent, scrollTarget: HTMLElement) {
    console.log(event);
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.data.length) {
      endIndex = this.data.length;
    }
    this.contributors = this.data.slice(startIndex, endIndex);

    scrollTarget.scrollIntoView({ behavior: 'smooth' });
  }

  trackById(index: number, contributor: any): number {
    return contributor.id;
  }

  onSelect(event) {
    if (event !== '0') {
      this.paginator.pageIndex = 0;
      this.data = this.data.sort(function (a, b) {
        return b[event] - a[event];
      });
      this.contributors = this.data.slice(0, this.paginator.pageSize);
    }
  }
  // ngAfterViewInit(): void {}

  // contributorsPage(contributor) {
  //   console.log(contributor);
  // }
}
