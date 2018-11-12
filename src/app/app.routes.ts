import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './services/auth.service';

import {LoginComponent} from './login/login.component';
import {EmailComponent} from './email/email.component';
import {SignupComponent} from './signup/signup.component';
import {MembersComponent} from './members/members.component';
import {NotesComponent} from './notes/notes.component';
import {WorkoutNotebooksComponent} from './notes/workout-notebooks/workout-notebooks.component';
import {WorkoutNotesComponent} from './notes/workout-notes/workout-notes.component';
import {TermsAndConditionsComponent} from './content/terms-and-conditions/terms-and-conditions.component';
import {PrivacyComponent} from './content/privacy/privacy.component';
import {RulesComponent} from './content/rules/rules.component';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'login-email', component: EmailComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'settings', component: MembersComponent, canActivate: [AuthGuard]},
    {path: 'current', component: NotesComponent},
    {path: 'notebooks', component: WorkoutNotebooksComponent},
    {path: 'notes', component: WorkoutNotesComponent},
    {path: 'terms-and-conditions', component: TermsAndConditionsComponent},
    {path: 'privacy-policy', component: PrivacyComponent},
    {path: 'rules', component: RulesComponent},
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
