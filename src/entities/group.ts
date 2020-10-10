import { IUser, userEntity } from "./user";
import { BaseEntity, createEntity } from "../normalizer";

export type IGroup = {
  users: IUser[];
} & BaseEntity<"groups">;

export const groupEntity = createEntity<IGroup>("groups", { users: [userEntity] });
