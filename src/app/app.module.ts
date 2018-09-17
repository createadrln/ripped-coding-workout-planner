/* ToDo restore service worker and make PWA */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {AppNavbarComponent} from './app-navbar/app-navbar.component';

import {AuthGuard} from './services/auth.service';
import {routes} from './app.routes';
import {LoginComponent} from './login/login.component';
import {EmailComponent} from './email/email.component';
import {SignupComponent} from './signup/signup.component';
import {MembersComponent} from './members/members.component';
import {NotesComponent} from './notes/notes.component';
import {WorkoutNotebookFormComponent} from './notes/workout-notebook-form/workout-notebook-form.component';
import {WorkoutNoteFormComponent} from './notes/workout-note-form/workout-note-form.component';

import {ReversePipe} from './pipes/reverse.pipe';
import {FilterPipe} from './pipes/filter.pipe';

// import { SearchPipe } from './pipes/search.pipe';

@NgModule({
    declarations: [
        AppComponent,
        AppNavbarComponent,
        ReversePipe,
        FilterPipe,
        LoginComponent,
        EmailComponent,
        SignupComponent,
        MembersComponent,
        NotesComponent,
        WorkoutNotebookFormComponent,
        WorkoutNoteFormComponent
    ],
    imports: [
        BrowserModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {
            enabled: environment.production
        }),
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        MatIconModule,
        NgbModule.forRoot(),
        routes
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
