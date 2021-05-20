import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWorkoutNotesComponent } from './current-workout-notes.component';

describe('CurrentWorkoutNotesComponent', () => {
  let component: CurrentWorkoutNotesComponent;
  let fixture: ComponentFixture<CurrentWorkoutNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentWorkoutNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWorkoutNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
