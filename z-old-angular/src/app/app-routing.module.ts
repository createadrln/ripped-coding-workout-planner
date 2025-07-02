import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_services/auth.service';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NotebooksComponent } from './components/workouts/notebooks/notebooks.component';
import { CurrentWorkoutNotesComponent } from './components/workouts/current-workout-notes/current-workout-notes.component';
import { AnalyticsComponent } from './components/workouts/analytics/analytics.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'notebooks', component: NotebooksComponent },
  { path: 'current-workout', component: CurrentWorkoutNotesComponent },
  { path: 'workout-analysis', component: AnalyticsComponent },
  // { path: 'notes', component: WorkoutNotesComponent },
  // { path: 'login-email', component: EmailComponent },
  // { path: 'settings', component: MembersComponent, canActivate: [AuthGuard] },
  // { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  // { path: 'privacy-policy', component: PrivacyComponent },
  // { path: 'rules', component: RulesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
