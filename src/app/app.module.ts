import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthGuard } from './services/auth.service';
import { AppRoutingModule } from './app.routes';
import { TagInputModule } from 'ngx-chips';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { NotesComponent } from './notes/notes.component';
import { WorkoutNotebooksComponent } from './notes/workout-notebooks/workout-notebooks.component';
import { WorkoutNotesComponent } from './notes/workout-notes/workout-notes.component';
import { WorkoutNotebookFormComponent } from './notes/workout-notebook-form/workout-notebook-form.component';
import { WorkoutNoteFormComponent } from './notes/workout-note-form/workout-note-form.component';
import { TermsAndConditionsComponent } from './content/terms-and-conditions/terms-and-conditions.component';
import { PrivacyComponent } from './content/privacy/privacy.component';
import { RulesComponent } from './content/rules/rules.component';

import { NotebooksComponent } from './notebooks/notebooks.component';
import { UsersComponent } from './users/users.component';
import { CommonComponent } from './common/common.component';
import { ComponentsComponent } from './notebooks/components/components.component';
import { PagesComponent } from './notebooks/pages/pages.component';
import { ApiComponent } from './shared/api/api.component';
import { ModelsComponent } from './shared/models/models.component';
import { ReversePipe } from './shared/pipes/reverse/reverse.pipe';
import { FilterPipe } from './shared/pipes/filter/filter.pipe';
import { KeyPipe } from './shared/pipes/key/key.pipe';

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
        WorkoutNoteFormComponent,
        WorkoutNotebooksComponent,
        WorkoutNotesComponent,
        KeyPipe,
        TermsAndConditionsComponent,
        PrivacyComponent,
        RulesComponent,
        NotebooksComponent,
        UsersComponent,
        CommonComponent,
        ComponentsComponent,
        PagesComponent,
        ApiComponent,
        ModelsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        MatIconModule,
        NgxSpinnerModule,
        TagInputModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
