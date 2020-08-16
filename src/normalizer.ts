/* eslint-disable @typescript-eslint/no-explicit-any */
import { schema, denormalize, normalize, NormalizedSchema } from "normalizr";
import { Schema, PickTypeReference, BaseSchema, NestArray } from "./types";
import { Entities } from "./entities";

type DictSchema<T extends { [key: string]: any }> = {
  [K in keyof T]: Schema<Exclude<T[K], undefined | null>>;
};
type RelatedEntities<T extends { [key: string]: any }> = DictSchema<PickTypeReference<T>>;
type Entity<D, T> = D extends Array<infer U> ? [Entity<U, T>] : schema.Entity<T>;
type Denormalized<D, S> = D extends Array<infer U> ? Array<Denormalized<U, S>> : S | undefined;
type Result<T> = T extends Array<infer U> ? Array<Result<U>> : string;

export const createEntity = <T extends BaseSchema>(
  entityName: string,
  relatedEntities: RelatedEntities<T>,
): schema.Entity<T> => new schema.Entity<T>(entityName, relatedEntities);

export const denormalizer = <D extends NestArray<string>, S, T extends Entities>(
  data: D,
  schema: Entity<D, S>,
  entities: T,
): Denormalized<D, S> => denormalize(data, schema, entities);

export const normalizer = <T>(data: T, schema: Schema<T>): NormalizedSchema<Entities, Result<T>> =>
  normalize<T, Entities, Result<T>>(data, schema);
