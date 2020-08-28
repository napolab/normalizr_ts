import { IUser, userEntity } from "./user";
import { createEntity } from "../normalizer";
import { BaseEntity } from "../types";

export type IGroup = {
  users: IUser[];
} & BaseEntity;

export const groupEntity = createEntity<IGroup>("groups", { users: [userEntity] });
