import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<IQuestion[]> {
    const questions = localStorage.getItem('questions');

    if (questions) {
      return new Observable((observer) => {
        observer.next(JSON.parse(questions));
        observer.complete();
      });
    } else {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
  }

  saveQuestion(question: IQuestion): Observable<IQuestion> {
    const questions = localStorage.getItem('questions');
    if (questions) {
      const parsedQuestions = JSON.parse(questions);
      if (parsedQuestions.some((q: IQuestion) => q.id === question.id)) {
        // update question
        const index = parsedQuestions.findIndex(
          (q: IQuestion) => q.id === question.id
        );
        parsedQuestions[index] = question;
        localStorage.setItem('questions', JSON.stringify(parsedQuestions));
        return new Observable((observer) => {
          observer.next(question);
          observer.complete();
        });
      } else {
        // add new question
        parsedQuestions.push(question);
        localStorage.setItem('questions', JSON.stringify(parsedQuestions));
        return new Observable((observer) => {
          observer.next(question);
          observer.complete();
        });
      }
    } else {
      localStorage.setItem('questions', JSON.stringify([question]));
    }

    return new Observable((observer) => {
      observer.next(question);
      observer.complete();
    });
  }
}
