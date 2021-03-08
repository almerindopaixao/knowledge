class Validator {
  existsOrError(value: unknown, msg: string): void {
    if (!value) throw msg;
    if (Array.isArray(value) && value.length === 0) throw msg;
    if (typeof value === 'string' && !value.trim()) throw msg;
  }

  notExistsOrError(value: unknown, msg: string): void {
    try {
      this.existsOrError(value, msg);
    } catch (msg) {
      return;
    }
    throw msg;
  }

  equalsOrError(valueA: unknown, valueB: unknown, msg: string): void {
    if (valueA !== valueB) throw msg;
  }
}

export default new Validator();
