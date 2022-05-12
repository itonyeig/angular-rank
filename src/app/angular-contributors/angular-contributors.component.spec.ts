import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularContributorsComponent } from './angular-contributors.component';

describe('AngularContributorsComponent', () => {
  let component: AngularContributorsComponent;
  let fixture: ComponentFixture<AngularContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularContributorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
