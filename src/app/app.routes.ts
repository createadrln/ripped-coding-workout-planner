import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {EmailComponent} from './email/email.component';
import {SignupComponent} from './signup/signup.component';

import {MembersComponent} from './members/members.component';

import {NotesComponent} from './notes/notes.component';
import {AuthGuard} from './services/auth.service';

export const router: Routes = [
    {path: '', redirectTo: 'notes', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'login-email', component: EmailComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'settings', component: MembersComponent, canActivate: [AuthGuard]},
    {path: 'notes', component: NotesComponent},
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
