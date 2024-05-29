export class AppError extends Error {
  isTrusted: boolean;

  constructor(message: string, public error?: any) {
    super(message);
    this.isTrusted = true;
  }
}
