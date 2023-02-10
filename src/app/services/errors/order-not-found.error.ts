export class OrderNotFoundError extends Error {
  constructor() {
    super('Order nout found');
  }
}
