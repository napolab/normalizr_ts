/* eslint-disable @typescript-eslint/no-explicit-any */
import { schema } from "normalizr";

type Primitive = number | string | boolean | null | undefined | symbol | never | void;
type ArrayToString<T> = T extends Array<infer U> ? Array<ArrayToString<U>> : string;

type TypeReferenceKeys<T extends { [key: string]: any }> = {
  [K in keyof T]: T[K] extends NonReferenceType ? never : K;
}[keyof T];

// utility types
export type NestArray<T> = T | Array<NestArray<T>>;
export type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T];
export type NonReferenceType = Primitive | NestArray<Primitive>;
export type PickTypeReference<T extends { [key: string]: any }> = Pick<T, TypeReferenceKeys<T>>;

// entity types
export type NormalizedEntity<T extends { [key: string]: any }> = {
  [K in keyof T]: T[K] extends NonReferenceType ? T[K] : ArrayToString<T[K]>;
};
export type BaseSchema = { id: string } & { [key: string]: any };
export type Schema<T> = T extends Array<infer U> ? [Schema<U>] : schema.Entity<T>;
