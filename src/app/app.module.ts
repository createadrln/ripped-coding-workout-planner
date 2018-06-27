import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';

import { AuthGuard } from './auth.service';
import { routes } from './app.routes';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { MembersComponent } from './members/members.component';
import { NotesComponent } from './notes/notes.component';

import { ReversePipe } from './shared/reverse.pipe';
// import { SearchPipe } from './shared/search.pipe';

@NgModule({
    declarations: [
        AppComponent,
        AppNavbarComponent,
        ReversePipe,
        // SearchPipe,
        LoginComponent,
        EmailComponent,
        MembersComponent,
        NotesComponent
    ],
    imports: [
        BrowserModule,
        // ServiceWorkerModule.register('/ngsw-worker.js', {
        //     enabled: environment.production
        // }),
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        NgbModule.forRoot(),
        routes
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
