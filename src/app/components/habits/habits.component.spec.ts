import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HabitsComponent } from './habits.component';

describe('HabitsComponent', () => {
  let component: HabitsComponent;
  let fixture: ComponentFixture<HabitsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
