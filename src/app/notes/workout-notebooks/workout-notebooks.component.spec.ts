import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutNotebooksComponent } from './workout-notebooks.component';

describe('WorkoutNotebooksComponent', () => {
  let component: WorkoutNotebooksComponent;
  let fixture: ComponentFixture<WorkoutNotebooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutNotebooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutNotebooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
