interface IOption {
  id: number;
  text: string;
  order: number;
  error?: string;
}
interface IToken {
  id: number;
  title: string;
  options: IOption[];
  width: number;
  height: number;
  correct: number;
  open: boolean;
}
interface IQuestion {
  id: number;
  question: string;
  tokens: IToken[];
  feedback: {
    correct: string;
    incorrect: string;
    partial: string;
  };
}
