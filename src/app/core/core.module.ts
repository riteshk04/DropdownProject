import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [DataService],
})
export class CoreModule {}
