import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss'],
})
export class QuestionPreviewComponent implements OnInit {
  question: IQuestion = {
    id: 0,
    question: '',
    tokens: [],
    feedback: {
      correct: '',
      incorrect: '',
      partial: '',
    },
  };
  questionMarkup: SafeHtml = '';
  answerChecked = false;
  answerShown = false;
  correctAnswers: string[] = [];
  generatedSelectTags: HTMLSelectElement[] = [];
  error?: string;

  @ViewChild('questionRef', { static: true }) questionDiv!: HTMLDivElement;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('questionId') || '');
    this.dataService.getQuestions().subscribe((data) => {
      if (!data.some((q) => q.id === id)) {
        this.router.navigate(['/question/new']);
      } else {
        this.question = data.find((q) => q.id === id) || this.question;
        this.questionMarkup = this.sanitizer.bypassSecurityTrustHtml(
          this.generateMarkup(true, this.questionDiv)
        );
      }
    });
  }

  generateMarkup(active = true, target: any = this.questionDiv) {
    let spanarr = this.question.question.split(/\[([^\]]+)\]/g);
    let tokens = this.question.tokens;

    const parentDiv = document.createElement('div');

    for (let i = 0, j = 0; i < spanarr.length; i++) {
      if (i % 2 !== 0) {
        const select = document.createElement('select');
        select.classList.add('select-answer');
        select.style.width = tokens[j].width + 'px';
        select.style.height = tokens[j].height + 'px';
        this.generatedSelectTags.push(select);
        const options = tokens[j++].options;

        const option = document.createElement('option');
        option.value = '';
        option.innerText = '--Select--';
        select.appendChild(option);

        for (let k = 0; k < options.length; k++) {
          const option = document.createElement('option');
          option.value = options[k].id + '';
          option.innerText = options[k].text;
          select.appendChild(option);
        }
        parentDiv.appendChild(select);
      } else {
        const span = document.createElement('span');
        span.innerText = spanarr[i];
        parentDiv.appendChild(span);
      }
    }

    target.nativeElement.appendChild(parentDiv);
    return '';
  }

  onAnswerCheck() {
    let valid = true;
    for (let i = 0; i < this.generatedSelectTags.length; i++) {
      if (this.generatedSelectTags[i].value.trim() === '') {
        valid = false;
        this.generatedSelectTags[i].style.borderColor = 'red';
      } else {
        this.generatedSelectTags[i].style.borderColor = 'black';
      }
    }
    if (!valid) {
      this.error = 'Please select an answer';
      return;
    } else {
      this.error = undefined;
    }
    this.answerChecked = !this.answerChecked;
    this.updateUI(this.answerChecked);
  }

  showAnswer() {
    this.answerShown = !this.answerShown;
    this.generateCorrectAnswers();
  }

  updateUI(active = false) {
    // this.questionMarkup = this.sanitizer.bypassSecurityTrustHtml(
    //   this.generateMarkup(active)
    // );
  }

  generateCorrectAnswers() {
    for (let i = 0; i < this.question.tokens.length; i++) {
      this.correctAnswers.push(
        this.question.tokens[i].options.find(
          (o) => o.id === this.question.tokens[i].correct
        )!.text
      );
    }
  }
}
