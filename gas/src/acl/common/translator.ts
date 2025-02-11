export interface Translator<T, V> {
  translate: (media: T, ...args: any[]) => V;
}
