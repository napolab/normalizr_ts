import { createEntity, BaseEntity } from "../normalizer";
import { IAddress, addressEntity } from "./address";
import { Complex } from "./complex";

export type IUser = {
  name: string;
  address: IAddress | null;
  keys: { a: string; b: number };
  complex: Complex | null;
  createdAt: Date;
} & BaseEntity<"users">;

export const userEntity = createEntity<IUser>("users", { address: addressEntity });
