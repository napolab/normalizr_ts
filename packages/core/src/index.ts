// normalize
import normalizr, { schema } from "normalizr";

import { Flatten, NestArray, Nothing, ReplaceArray, UnionToIntersection } from "./utility";

declare const $entity: unique symbol;
type ID = string | number;
type Entity<T extends string> = {
  readonly [$entity]?: T;
  id: ID;
};

type ReferenceKeys<T> = {
  [K in keyof T]-?: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? K : never;
}[keyof T];
type References<T> = {
  [K in ReferenceKeys<T>]-?: ReplaceArray<Exclude<T[K], Nothing>, schema.Entity<Flatten<Exclude<T[K], Nothing>>>>;
};

type Normalize<T> = {
  [K in keyof T]: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? ReplaceArray<T[K], ID> : T[K];
};
type PickShallowEntity<T> = {
  [K in keyof T]-?: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? Exclude<Flatten<T[K]>, Nothing> : never;
}[keyof T];
type UnionEntities<T> = T extends never ? never : PickShallowEntity<T> | UnionEntities<PickShallowEntity<T>>;
type ToWithKey<T> = T extends Entity<infer U> ? { [K in U]: T } : never;

type Schema<T> = Flatten<T> extends Entity<string> ? ReplaceArray<T, schema.Entity<Flatten<T>>> : never;
type MapEntities<T> = {
  [K in keyof T]: { [key: string]: Normalize<T[K]> };
};
type Entities<T> = MapEntities<UnionToIntersection<ToWithKey<UnionEntities<T>>>>;
type Normalized<T> = {
  result: ReplaceArray<T, ID>;
  entities: Entities<Flatten<T>>;
};

function createEntity<E>(name: E extends Entity<infer U> ? U : never, references: References<E>): schema.Entity<E> {
  return new schema.Entity<E>(name, references);
}
function normalize<T>(data: T, schema: Schema<T>): Normalized<T> {
  return normalizr.normalize(data, schema);
}
function denormalize<D extends NestArray<E["id"]>, E extends Entity<string>>(
  data: D,
  schema: ReplaceArray<D, schema.Entity<E>>,
  entities: Entities<E>,
): E {
  return normalizr.denormalize(data, schema, entities);
}

export { Entity, Normalize, MapEntities, createEntity, normalize, denormalize };
