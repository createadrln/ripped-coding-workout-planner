import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutNoteFormComponent } from './workout-note-form.component';

describe('WorkoutNoteFormComponent', () => {
  let component: WorkoutNoteFormComponent;
  let fixture: ComponentFixture<WorkoutNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
