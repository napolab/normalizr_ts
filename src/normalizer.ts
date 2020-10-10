import { schema, denormalize as denormalizr, normalize as normaliz, NormalizedSchema } from "normalizr";

// utility type
type Nothing = null | undefined;
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type NestedArray<T> = T | Array<NestedArray<T>>;
type Flatten<T> = T extends NestedArray<infer U> ? U : never;
type Schema<T> = T extends Array<infer U> ? [Schema<U>] : schema.Entity<T>;

/* Merge this type (BaseEntity) into any user-defined entity.
 * Enter the key name of the normalized entities in Generic as a string.
 * ex) type IUser = { name: string } & BaseEntity<"users">
 */
export type BaseEntity<T extends string> = {
  readonly _$entity?: T;
  id: string | number;
};

type PickEntityKey<T> = Exclude<
  { [K in keyof T]: Exclude<Flatten<Exclude<T[K], Nothing>>, Nothing> extends BaseEntity<string> ? K : never }[keyof T],
  Nothing
>;
type PickEntity<T> = { [K in PickEntityKey<T>]: Exclude<T[K], Nothing> };
type PickEntityType<T> = PickEntity<T> extends never ? never : Flatten<PickEntity<T>[keyof PickEntity<T>]>;
type DeepFindEntity<T> = PickEntityType<T> extends never
  ? Record<string, never>
  : PickEntityType<T> | PickEntityType<PickEntityType<T>>;

type EntityToWithKeyEntity<T> = T extends BaseEntity<infer U>
  ? { [K in U]: { [key: string]: Normalized<T> } }
  : Record<string, unknown>;

// The type of entities obtained by normalizing the entity type.
type Entities<T extends BaseEntity<string>> = EntityToWithKeyEntity<T> &
  UnionToIntersection<EntityToWithKeyEntity<DeepFindEntity<T>>>;

// createEntity

type DictSchema<T extends { [key: string]: unknown }> = {
  [K in keyof T]: Schema<Exclude<T[K], undefined | null>>;
};

type RelatedEntities<T extends { [key: string]: unknown }> = DictSchema<PickEntity<T>>;

export const createEntity = <T extends BaseEntity<string>>(
  entityName: T extends BaseEntity<infer U> ? U : never,
  relatedEntities: RelatedEntities<T>,
): schema.Entity<T> => new schema.Entity<T>(entityName, relatedEntities);

// normalize

type EntityToRef<T> = T extends Array<infer U> ? Array<EntityToRef<U>> : T extends BaseEntity<string> ? T["id"] : T;
export type Normalized<T extends BaseEntity<string>> = {
  [K in keyof T]: K extends keyof PickEntity<T> ? EntityToRef<T[K]> : T[K];
};

type Result<T> = T extends Array<infer U> ? Array<Result<U>> : string;

export const normalize = <T extends BaseEntity<string>>(
  data: T,
  schema: Schema<T>,
): NormalizedSchema<Entities<T>, Result<T>> => normaliz<T, Entities<T>, Result<T>>(data, schema);

// denormalize

type Denormalized<D, S> = D extends Array<infer U> ? Array<Denormalized<U, S>> : S | undefined;
type DataToEntity<D, T> = D extends Array<infer U> ? [DataToEntity<U, T>] : schema.Entity<T>;

export const denormalize = <D extends NestedArray<BaseEntity<string>["id"]>, S extends BaseEntity<string>>(
  data: D,
  schema: DataToEntity<D, S>,
  entities: Entities<S>,
): Denormalized<D, S> => denormalizr(data, schema, entities);
