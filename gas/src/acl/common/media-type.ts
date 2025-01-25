export interface Reader<T> {
  read: (content: string) => T;
}

export interface Writer<T> {
  write: (...args: Array<T>) => string;
}
