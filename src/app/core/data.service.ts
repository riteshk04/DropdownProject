import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>('/assets/questions.json').pipe();
  }

  getNewQuestions(): Observable<IQuestion> {
    return this.http.get<IQuestion>('/assets/new-question.json').pipe();
  }
}
