import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(`assets/questions.json`);
  }

  saveQuestion(question: IQuestion): Observable<IQuestion> {
    return this.http.post<IQuestion>(`assets/questions.json`, question);
  }
}
