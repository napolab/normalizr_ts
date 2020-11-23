import { normalize, denormalize, Entity, createEntity, MapEntities } from "..";

type Nest = {
  nest: string;
} & Entity<"nests">;
const nestEntity = createEntity<Nest>("nests", {});

type Nyaaan = {
  cat: "neco";
  nest?: Nest[][];
} & Entity<"nyaans">;
const nyaanEntity = createEntity<Nyaaan>("nyaans", {
  nest: [[nestEntity]],
});

type Hoge = {
  hoge: string;
  cat: Nyaaan;
  nest?: Nest | null;
} & Entity<"hoges">;
const hogeEntity = createEntity<Hoge>("hoges", {
  cat: nyaanEntity,
  nest: nestEntity,
});

type Huga = {
  huga: string;
} & Entity<"hugas">;
const hugaEntity = createEntity<Huga>("hugas", {});
type HogeAndHuga = {
  a: string;
  hoge: Hoge;
  hoges: Hoge[];
  nullableHoge: Hoge | null;
  optionHoge?: Hoge;
  huga: Huga;
  hugas: Huga[];
  nullableHuga: Huga | null;
  optionHuga?: Huga;
} & Entity<"hogeAndHugas">;
const hogeAndHugaEntity = createEntity<HogeAndHuga>("hogeAndHugas", {
  hoges: [hogeEntity],
  hoge: hogeEntity,
  hugas: [hugaEntity],
  huga: hugaEntity,
  nullableHoge: hogeEntity,
  nullableHuga: hugaEntity,
  optionHoge: hogeEntity,
  optionHuga: hugaEntity,
});

type E1 = MapEntities<{
  hoges: Hoge;
  hugas: Huga;
  nyaans: Nyaaan;
  nests: Nest;
  hogeAndHugas: HogeAndHuga;
}>;
declare const e: E1;
declare const hogeAndHuga: HogeAndHuga;

const { result, entities } = normalize(hogeAndHuga, hogeAndHugaEntity);
denormalize(result, hogeAndHugaEntity, e);
