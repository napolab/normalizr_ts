import { schema } from "normalizr";

type Primitive = number | string | boolean | null | undefined | symbol | never | void;
type ArrayToString<T> = T extends Array<infer U> ? Array<ArrayToString<U>> : string;

// utility types
export type NestArray<T> = T | Array<NestArray<T>>;
export type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T];
export type NonReferenceType = Primitive | NestArray<Primitive>;

// entity types
export type BaseEntity = {
  id: string;
};

// T[K]が無限ネストの配列である可能性がある
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Flatten<T extends NestArray<unknown>> = T extends NestArray<infer I> ? I : never;

type FindKeys<T> = {
  [K in keyof T]: keyof BaseEntity extends keyof Flatten<T[K]> ? K : never;
}[keyof T];

export type Find<T> = {
  [K in FindKeys<T>]: T[K];
};
export type NormalizedEntity<T extends { [key: string]: unknown }> = {
  [K in keyof T]: K extends keyof Find<T> ? ArrayToString<T[K]> : T[K];
};
export type BaseSchema = { id: string } & { [key: string]: unknown };
export type Schema<T> = T extends Array<infer U> ? [Schema<U>] : schema.Entity<T>;
