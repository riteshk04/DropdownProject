import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DropdownQuestionComponent } from './dropdown-question.component';
import { QuestionPreviewComponent } from './question-preview/question-preview.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DropdownQuestionComponent, QuestionPreviewComponent],
  exports: [DropdownQuestionComponent],
})
export class DropdownQuestionModule {}
