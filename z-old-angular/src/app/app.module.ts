import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
// import { ServiceWorkerModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { WorkoutsComponent } from './components/workouts/workouts.component';
import { NotebooksComponent } from './components/workouts/notebooks/notebooks.component';
import { CurrentWorkoutNotesComponent } from './components/workouts/current-workout-notes/current-workout-notes.component';
import { ExercisesComponent } from './components/workouts/exercises/exercises.component';
import { HabitsComponent } from './components/habits/habits.component';
import { AnalyticsComponent } from './components/habits/analytics/analytics.component';
import { PagesComponent } from './components/pages/pages.component';
import { AboutComponent } from './components/pages/about/about.component';
import { TermsAndConditionsComponent } from './components/pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyComponent } from './components/pages/privacy/privacy.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageComponent } from './components/page/page.component';
import { ApiComponent } from './shared/api/api.component';
import { ClassesComponent } from './shared/classes/classes.component';
import { ModelsComponent } from './shared/models/models.component';

// Pipes
import { ReversePipe } from './shared/pipes/reverse.pipe';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { KeyPipe } from './shared/pipes/key.pipe';

import { environment } from 'src/environments/environment';
import { AuthGuard } from './_services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { TagInputModule } from 'ngx-chips';
// import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    WorkoutsComponent,
    NotebooksComponent,
    ExercisesComponent,
    HabitsComponent,
    AnalyticsComponent,
    PagesComponent,
    AboutComponent,
    TermsAndConditionsComponent,
    PrivacyComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    PageComponent,
    ApiComponent,
    ClassesComponent,
    ModelsComponent,
    ReversePipe,
    FilterPipe,
    KeyPipe,
    CurrentWorkoutNotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    MatIconModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
