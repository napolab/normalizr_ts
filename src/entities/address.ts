import { createEntity } from "../normalizer";

export type IAddress = {
  id: string;
  name: string;
};

export const addressEntity = createEntity<IAddress>("addresses", {});
