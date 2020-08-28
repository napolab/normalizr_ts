import { createEntity } from "../normalizer";
import { BaseEntity } from "../types";

export type IAddress = {
  name: string;
} & BaseEntity;

export const addressEntity = createEntity<IAddress>("addresses", {});
