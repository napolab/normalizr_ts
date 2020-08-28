import { createEntity } from "../normalizer";
import { IAddress, addressEntity } from "./address";
import { BaseEntity } from "../types";
import { Complex } from "./complex";

export type IUser = {
  name: string;
  address: IAddress;
  keys: { a: string; b: number };
  complex: Complex;
} & BaseEntity;

export const userEntity = createEntity<IUser>("users", { address: addressEntity });
