import { BaseEntity, createEntity } from "../normalizer";

export type IAddress = {
  name: string;
} & BaseEntity<"addresses">;

export const addressEntity = createEntity<IAddress>("addresses", {});
