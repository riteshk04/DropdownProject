import { NgModule } from '@angular/core';
import { TokenPipe, ValidationPipe } from './question.pipe';

@NgModule({
  declarations: [TokenPipe, ValidationPipe],
  exports: [TokenPipe, ValidationPipe],
})
export class SharedModule {}
