import { NgModule } from '@angular/core';

import { DropdownQuestionComponent } from './dropdown-question.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DropdownQuestionComponent],
  exports: [DropdownQuestionComponent],
})
export class DropdownQuestionModule {}
