// utility
export type Nothing = undefined | null;
export type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;
export type NestArray<T> = T | Array<NestArray<T>>;
export type ReplaceArray<T, V> = T extends Array<infer U> ? Array<ReplaceArray<U, V>> : V;
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
