import { IUser } from "./user";
import { IGroup } from "./group";
import { IAddress } from "./address";
import { NormalizedEntity } from "../types";

export type Entities = {
  users: { [key: string]: NormalizedEntity<IUser> };
  groups: { [key: string]: NormalizedEntity<IGroup> };
  addresses: { [key: string]: NormalizedEntity<IAddress> };
};

// reduxのcombineReducerの型からEntitiesを導出する型
// type E = ReturnType<typeof entities>;
// export type Keys = Exclude<FilteredKeys<E, undefined>, undefined>;
// export type Entities = { [K in Keys]?: E[K] };
