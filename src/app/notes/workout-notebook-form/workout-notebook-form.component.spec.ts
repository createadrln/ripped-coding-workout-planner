import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutNotebookFormComponent } from './workout-notebook-form.component';

describe('WorkoutNotebookFormComponent', () => {
  let component: WorkoutNotebookFormComponent;
  let fixture: ComponentFixture<WorkoutNotebookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutNotebookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutNotebookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
