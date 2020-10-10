import { schema } from "normalizr";

type ArrayToString<T> = T extends Array<infer U> ? Array<ArrayToString<U>> : string;

// utility types
export type NestArray<T> = T | Array<NestArray<T>>;
export type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T];

// entity types
export type BaseEntity = {
  id: string;
  _$entity?: unknown;
};

// T[K]が無限ネストの配列である可能性がある
type Flatten<T extends NestArray<unknown>> = T extends NestArray<infer I> ? I : never;

type FindKeys<T> = {
  [K in keyof T]: Exclude<Flatten<T[K]>, undefined | null> extends BaseEntity ? K : never;
}[keyof T];

export type Find<T> = {
  [K in FindKeys<T>]: T[K];
};
export type NormalizedEntity<T extends { [key: string]: unknown }> = {
  [K in keyof T]: K extends keyof Find<T> ? ArrayToString<T[K]> : T[K];
};
export type BaseSchema = { id: string } & { [key: string]: unknown };
export type Schema<T> = T extends Array<infer U> ? [Schema<U>] : schema.Entity<T>;
