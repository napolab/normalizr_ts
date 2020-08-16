import { createEntity } from "../normalizer";
import { IAddress, addressEntity } from "./address";

export type IUser = {
  id: string;
  name: string;
  address: IAddress;
};

export const userEntity = createEntity<IUser>("users", { address: addressEntity });
