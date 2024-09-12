import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropdownQuestionComponent } from './dropdown-question/dropdown-question.component';
import { QuestionPreviewComponent } from './dropdown-question/question-preview/question-preview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'question',
    pathMatch: 'full',
  },
  {
    path: 'question/:questionId',
    component: DropdownQuestionComponent,
  },
  {
    path: 'question/:questionId/preview',
    component: QuestionPreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
