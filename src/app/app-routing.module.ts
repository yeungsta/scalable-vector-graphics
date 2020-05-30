import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SvgsketchComponent } from './svgsketch/svgsketch.component';
import { SleepartComponent } from './sleepart/sleepart.component';
import { DarelcareyComponent } from './darelcarey/darelcarey.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'main', component: MainComponent },
  { path: 'svgsketch', component: SvgsketchComponent },
  { path: 'sleepart', component: SleepartComponent },
  { path: 'darelcarey', component: DarelcareyComponent, runGuardsAndResolvers: "always" }, //allows reloading of URL
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })], //allows reloading of URL
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
