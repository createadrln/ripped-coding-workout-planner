import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_services/auth.service';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NotebooksComponent } from './components/workouts/notebooks/notebooks.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'notebooks', component: NotebooksComponent },
  // { path: 'login-email', component: EmailComponent },
  // { path: 'settings', component: MembersComponent, canActivate: [AuthGuard] },
  // { path: 'notebook', component: NotesComponent },
  // { path: 'notes', component: WorkoutNotesComponent },
  // { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  // { path: 'privacy-policy', component: PrivacyComponent },
  // { path: 'rules', component: RulesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
