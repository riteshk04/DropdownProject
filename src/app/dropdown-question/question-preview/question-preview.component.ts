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
  generatedSelectWrappers: HTMLSpanElement[] = [];
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
        this.generateCorrectAnswers();
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
    parentDiv.style.display = 'flex';
    parentDiv.style.flexWrap = 'wrap';
    parentDiv.style.alignItems = 'center';
    parentDiv.style.rowGap = '10px';
    parentDiv.style.columnGap = '6px';

    for (let i = 0, j = 0; i < spanarr.length; i++) {
      if (i % 2 !== 0) {
        const selectWrapper = document.createElement('span');
        selectWrapper.style.height = tokens[j].height + 'px';
        selectWrapper.style.display = 'inline-flex';
        parentDiv.appendChild(selectWrapper);

        const answerLabel = document.createElement('label');
        answerLabel.innerText = j + 1 + '';
        answerLabel.style.padding = '4px';
        answerLabel.style.border = '1px solid black';
        answerLabel.style.borderRight = 'none';

        selectWrapper.appendChild(answerLabel);

        const answerIcon = document.createElement('i');
        answerIcon.classList.add('fa');
        answerIcon.style.backgroundColor = 'green';
        answerIcon.style.color = 'white';
        answerIcon.style.padding = '4px';

        const select = document.createElement('select');
        select.classList.add('select-answer');
        select.style.width = tokens[j].width + 'px';
        select.style.height = tokens[j].height + 'px';
        select.style.borderRadius = '0px';
        select.style.outline = 'none';

        this.generatedSelectWrappers.push(selectWrapper);
        const options = tokens[j++].options;

        const option = document.createElement('option');
        option.value = '';
        option.innerText = '--Select--';
        select.appendChild(option);

        for (let k = 0; k < options.length; k++) {
          const option = document.createElement('option');
          option.value = options[k].text;
          option.innerText = options[k].text;
          select.appendChild(option);
        }
        selectWrapper.appendChild(select);
        selectWrapper.appendChild(answerIcon);
        answerIcon.style.display = 'none';
        answerLabel.style.display = 'none';
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
    for (let i = 0; i < this.generatedSelectWrappers.length; i++) {
      const selectElement =
        this.generatedSelectWrappers[i].querySelector('select');
      if (!selectElement) {
        valid = false;
        break;
      }
      if (selectElement.value.trim() === '') {
        valid = false;
        selectElement.style.borderColor = 'red';
      } else {
        selectElement.style.borderColor = 'black';
      }
    }
    if (!valid) {
      this.error = 'Please select an answer';
      return;
    } else {
      this.error = undefined;
    }
    this.answerChecked = !this.answerChecked;
    this.highlightAnswers(this.answerChecked);
  }

  showAnswer() {
    this.answerShown = !this.answerShown;
    this.onAnswerCheck();
  }

  highlightAnswers(active = false) {
    for (let i = 0; i < this.generatedSelectWrappers.length; i++) {
      const selectElement =
        this.generatedSelectWrappers[i].querySelector('select');
      const selectWrapper = this.generatedSelectWrappers[i];
      if (!selectElement) {
        continue;
      }
      const answerLabel = selectWrapper.querySelector('label')!;
      answerLabel.style.display = active ? 'inline-block' : 'none';
      answerLabel.style.alignContent = 'center';

      const answerIcon = selectWrapper.querySelector('i')!;
      answerIcon.style.display = active ? 'inline-block' : 'none';

      if (selectElement.value.trim() === this.correctAnswers[i].trim()) {
        answerLabel.style.borderColor = 'green';
        selectElement.style.borderColor = 'green';
        answerIcon.style.backgroundColor = 'green';
        answerIcon.classList.remove('fa-times');
        answerIcon.classList.add('fa-check');
      } else {
        selectElement.style.borderColor = 'red';
        answerLabel.style.borderColor = 'red';
        answerIcon.style.backgroundColor = 'red';
        answerIcon.classList.add('fa-times');
        answerIcon.classList.remove('fa-check');
      }
      if (!active) {
        selectElement.style.borderColor = 'black';
      }
    }
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
