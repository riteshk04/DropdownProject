import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropdownQuestionComponent } from './dropdown-question/dropdown-question.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'question',
    pathMatch: 'full',
  },
  {
    path: 'question',
    component: DropdownQuestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
