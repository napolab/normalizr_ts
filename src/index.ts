import { IAddress } from "./entities/address";
import { IUser, userEntity } from "./entities/user";
import { IGroup, groupEntity } from "./entities/group";

import { normalize, denormalize } from "./normalizer";

const address: IAddress = {
  id: "address1",
  name: "hogehoge-city",
};

const user1: IUser = {
  id: "user1",
  name: "naporitan",
  address,
  keys: { a: "naporitan", b: 1 },
  complex: { hoge: "" },
  createdAt: new Date(),
};

const user2: IUser = {
  id: "user2",
  name: "naporitan2",
  address,
  keys: { a: "naporitan2", b: 2 },
  complex: { huga: "" },
  createdAt: new Date(),
};

const group: IGroup = {
  id: "gorup1",
  users: [user1, user2],
};

// entityの塊とidの塊に分ける
const { entities, result } = normalize(group, groupEntity);
console.log("result", result);
type EntitiesKeys1 = keyof typeof entities;
console.log("entities", JSON.stringify(entities, null, 2));

// groupオブジェクトがid: stringの形から戻る
console.log(denormalize(result, groupEntity, entities));

// groupからuserIDを引いてそれをdenormalizeしてみる
console.log(denormalize(entities.groups[result].users, [userEntity], entities));
