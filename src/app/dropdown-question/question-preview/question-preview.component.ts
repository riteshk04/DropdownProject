import { Component, OnInit } from '@angular/core';
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
          this.generateMarkup()
        );
      }
    });
  }

  generateMarkup() {
    let markup = '';

    let title =
      'Q.1: ' +
      this.question.question.replace(/\[([^\]]+)\]/g, `<select></select>`);

    let parsedHtml = new DOMParser().parseFromString(title, 'text/html');
    let selects = parsedHtml.querySelectorAll('select');

    for (let i = 0; i < selects.length; i++) {
      const element = selects[i];
      element.style.height = this.question.tokens[i].height + 'px';
      element.style.width = this.question.tokens[i].width + 'px';
    }

    for (let i = 0; i < selects.length; i++) {
      let options = this.question.tokens[i].options;
      for (let j = 0; j < options.length; j++) {
        let option = document.createElement('option');
        option.value = options[j].text;
        option.text = options[j].text;
        selects[i].appendChild(option);
      }
    }
    markup = parsedHtml.body.innerHTML;

    return markup;
  }
}
