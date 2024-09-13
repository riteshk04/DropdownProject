import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foundemptytokens',
  pure: false,
})
export class TokenPipe implements PipeTransform {
  transform(options: IOption[]): any {
    return options.every((opt) => opt.text.trim().length > 0) ? '' : 'disabled';
  }
}

@Pipe({
  name: 'validationpipe',
  pure: false,
})
export class ValidationPipe implements PipeTransform {
  transform(question: IQuestion): any {
    let valid = true;
    question.question.trim().length > 0 ? {} : (valid = false);
    question.tokens.length > 0 ? {} : (valid = false);

    question.tokens.forEach((token) => {
      token.correct > -1 ? {} : (valid = false);
      token.options.length > 0 ? {} : (valid = false);
      token.options.forEach((opt) => {
        opt.text.trim().length > 0 ? {} : (valid = false);
      });
    });

    return valid ? '' : 'disabled';
  }
}
