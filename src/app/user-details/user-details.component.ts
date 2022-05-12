import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contributor, CacheStrorage } from '../shared/interface/contributors';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  stroge: CacheStrorage = JSON.parse(localStorage.getItem('contributors'));
  data = this.stroge.value;
  contributor: Contributor;
  sub: Subscription;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((param) => {
      const id = +param.get('id');
      console.log(id);
      this.contributor = this.data.find((contributor) => contributor.id === id);
      if (this.contributor) {
        this.contributor.repoNames = [
          ...this.contributor.repoNames,
          this.contributor.repoName,
        ];
        console.log(this.contributor);
      }

      if (!this.contributor) {
        this.router.navigate(['/contributors']);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  routeToRepo(name: string) {
    this.router.navigate(['/repo', name]);
  }
}
