import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { WorkoutsComponent } from './components/workouts/workouts.component';
import { NotebooksComponent } from './components/workouts/notebooks/notebooks.component';
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
import { PipesComponent } from './shared/pipes/pipes.component';

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
    PipesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
