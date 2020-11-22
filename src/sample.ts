// utility
type Nothing = undefined | null;
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type ReplaceArray<T, V> = T extends Array<infer U> ? Array<ReplaceArray<U, V>> : V;

// normalize
import { schema } from "normalizr"
declare const $entity: unique symbol
type ID = string | number;
type Entity<T extends string> = {
    readonly [$entity]?: T;
    id: ID
}
type Data<T> = T | Array<Data<T>>;

type ReferenceKeys<T> = {
    [K in keyof T]-?: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? K : never
}[keyof T]
type References<T> = {
    [K in ReferenceKeys<T>]-?: ReplaceArray<Exclude<T[K], Nothing>, schema.Entity<Flatten<Exclude<T[K], Nothing>>>>
}

type Normalize<T> = {
    [K in keyof T]: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? ReplaceArray<T[K], ID> : T[K]
}
type PickShallowEntity<T> = {
    [K in keyof T]-?: Exclude<Flatten<T[K]>, Nothing> extends Entity<string> ? Exclude<Flatten<T[K]>, Nothing> : never
}[keyof T];
type UnionEntities<T> = T extends never ? never : PickShallowEntity<T> | UnionEntities<PickShallowEntity<T>>;
type ToWithKey<T> = T extends Entity<infer U> ? { [K in U]: T } : never

type Schema<T> = Flatten<T> extends Entity<string> ? ReplaceArray<T, schema.Entity<Flatten<T>>> : never
type MapEntities<T> = {
    [K in keyof T]: { [key: string]: Normalize<T[K]> }
}
type Entities<T> = MapEntities<UnionToIntersection<ToWithKey<UnionEntities<T>>>>
type Normalized<T> = {
    result: ReplaceArray<T, ID>;
    entities: Entities<Flatten<T>>
}

declare function createEntity<E>(name: E extends Entity<infer U> ? U : never, references: References<E>): schema.Entity<E>
declare function normalize<T>(data: T, schema: Schema<T>): Normalized<T>
declare function denormalize<D extends Data<E["id"]>, E extends Entity<string>>(data: D, schema: ReplaceArray<D, schema.Entity<E>>, entities: Entities<E>): E

export {
  createEntity,
  normalize,
  denormalize,
  Entity
}



// test
type Nest = {
    nest: string;
} & Entity<"nests">
const nestEntity = createEntity<Nest>("nests", {

})
type Nyaaan = {
    cat: "neco",
    nest?: Nest[][]
} & Entity<"nyaans">
const nyaanEntity = createEntity<Nyaaan>("nyaans", {
    nest: [[nestEntity]]
})

type Hoge = {
    hoge: string;
    cat: Nyaaan
    nest?: Nest | null
} & Entity<"hoges">
const hogeEntity = createEntity<Hoge>("hoges", {
    cat: nyaanEntity,
    nest: nestEntity
})

type Huga = {
    huga: string;
} & Entity<"hugas">
const hugaEntity = createEntity<Huga>("hugas", {

})
type HogeAndHuga = {
    a: string
    hoge: Hoge;
    hoges: Hoge[];
    nullableHoge: Hoge | null;
    optionHoge?: Hoge;
    huga: Huga;
    hugas: Huga[];
    nullableHuga: Huga | null;
    optionHuga?: Huga
} & Entity<"hogeAndHugas">
const hogeAndHugaEntity = createEntity<HogeAndHuga>("hogeAndHugas", {
    hoges: [hogeEntity],
    hoge: hogeEntity,
    hugas: [hugaEntity],
    huga: hugaEntity,
    nullableHoge: hogeEntity,
    nullableHuga: hugaEntity,
    optionHoge: hogeEntity,
    optionHuga: hugaEntity
})

type E1 =  MapEntities<{
    hoges: Hoge;
    hugas: Huga;
    nyaans: Nyaaan;
    nests: Nest;
    hogeAndHugas: HogeAndHuga
}>
declare const e: E1;
declare const hogeAndHuga: HogeAndHuga;

const { result, entities } = normalize(hogeAndHuga, hogeAndHugaEntity)
denormalize(result, hogeAndHugaEntity, e)
