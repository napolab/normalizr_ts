import { createEntity } from "../normalizer";
import { IAddress, addressEntity } from "./address";
import { BaseEntity } from "../types";

export type IUser = {
  name: string;
  address: IAddress;
  keys: { a: string; b: number };
} & BaseEntity;

export const userEntity = createEntity<IUser>("users", { address: addressEntity });
