import { Component } from '@angular/core';
import { DataService } from '../core/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.scss'],
})
export class DropdownQuestionComponent {
  questionTitleHTML: string = '';
  setPropertiesDropdownOpen = true;
  feedbackDropdownOpen = false;

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

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Initializes the component by fetching questions and new question from the data service
   * and storing them in the component's questions array.
   */
  ngOnInit(): void {
    const id =
      parseInt(this.route.snapshot.paramMap.get('questionId') || '') || 0;

    this.dataService.getQuestions().subscribe((data) => {
      if (!data.some((q) => q.id === id)) {
        this.router.navigate(['/question/new']);
      }
      this.question = data.find((q) => q.id === id) || this.question;
      this.onBlurQuestion(this.question.question);
    });
  }

  toggleFeedbackDropdown() {
    this.feedbackDropdownOpen = !this.feedbackDropdownOpen;
  }

  toggleSetPropertiesDropdown() {
    this.setPropertiesDropdownOpen = !this.setPropertiesDropdownOpen;
  }

  onSaveAndPreview() {
    this.question.tokens.forEach((token) => {
      token.options.forEach((opt) => {
        if (opt.text.trim().length < 1) {
          opt.error = 'Please enter an option';
        } else {
          opt.error = undefined;
        }
      });
    });

    if (this.question.question.trim().length < 1) {
      this.questionTitleHTML = 'Please enter a question';
      return;
    }
    this.questionTitleHTML = '';
    this.dataService.saveQuestion(this.question);
    window.open(`/question/${this.question.id}/preview`, '_blank');
  }

  // Question

  onOptionChange(event: any, option: IOption) {
    if (event.target.value.trim() === '') {
      option.error = 'Please enter an option';
      return;
    }
    option.text = event.target.value;

    this.question.tokens.forEach((token) => {
      token.options.forEach((opt) => {
        if (opt.text.trim().length < 1) {
          opt.error = 'Please enter an option';
        } else {
          opt.error = undefined;
        }
      });
    });
  }

  onAddOption(token: IToken) {
    if (token.options.some((option) => option.text === '')) {
      token.options.forEach((option) => {
        if (option.text === '') {
          option.error = 'Please enter an option';
        }
      });
      return;
    }
    token.options.push({
      id: token.options.length + 1,
      text: '',
      order: token.options.length + 1,
    });
  }

  onRemoveOption(token: IToken, option: IOption) {
    token.options = token.options.filter((opt) => opt.id !== option.id);
    if (token.options.length < 2) {
      token.options.push({
        id: Math.floor(Math.random() * 1000) + 1,
        text: '',
        order: 1,
      });
    }
  }

  onChangeQuestion(event: any) {
    this.question.question = event.target.innerHTML;
  }

  onBlurQuestion(event: any) {
    const tokens = this.question.question.match(/\[([^\]]+)\]/g);
    let generatedMarkup = this.question.question.replace(
      /\[([^\]]+)\]/g,
      `<span class="token-mark">$1</span>`
    );

    // const oldTokenTitles = this.question.tokens.map((token) => token.title);
    // const newTokenTitles = tokens?.map((token) =>
    //   token.replace('[', '').replace(']', '')
    // );
    // if (JSON.stringify(oldTokenTitles) !== JSON.stringify(newTokenTitles)) {
    this.question.tokens = [];
    // }
    if (tokens) {
      tokens.forEach((token) => {
        const id = this.question.tokens.length + 1;
        this.question.tokens.push({
          id,
          title: token.replace('[', '').replace(']', ''),
          options: [
            {
              id: 1,
              text: '',
              order: 1,
              error: undefined,
            },
            {
              id: 2,
              text: '',
              order: 2,
              error: undefined,
            },
          ],
          width: 96,
          height: 28,
          correct: -1,
          open: false,
        });
      });

      function htmlParser(html: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
      }

      let body = htmlParser(generatedMarkup);
      body
        .querySelectorAll('span')
        .forEach((span: HTMLSpanElement, i: number) => {
          span.style.width = this.question.tokens[i].width + 'px';
          span.style.height = this.question.tokens[i].height + 'px';
        });

      generatedMarkup = body.body.innerHTML;
    }

    this.questionTitleHTML = generatedMarkup;
  }

  onFocusQuestion(event: any) {
    event.target.innerHTML = this.question.question;
  }

  onAddToken() {
    this.question.tokens.push({
      id: this.question.tokens.length + 1,
      title: '',
      options: [],
      width: 200,
      height: 32,
      correct: 0,
      open: false,
    });
  }

  onAnswerChange(event: any, token: IToken) {
    token.correct = Number(event.target.value);
  }
}
