export class AppError extends Error {
  isTrusted: boolean;
  constructor(message: string) {
    super(message);
    this.isTrusted = true;
  }
}
