import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutNotesComponent } from './workout-notes.component';

describe('WorkoutNotesComponent', () => {
  let component: WorkoutNotesComponent;
  let fixture: ComponentFixture<WorkoutNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
