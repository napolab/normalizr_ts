import { IAddress } from "./entities/address";
import { IUser, userEntity } from "./entities/user";
import { IGroup, groupEntity } from "./entities/group";
import { normalizer, denormalizer } from "./normalizer";

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
};

const user2: IUser = {
  id: "user2",
  name: "naporitan2",
  address,
  keys: { a: "naporitan2", b: 2 },
  complex: { huga: "" },
};

const group: IGroup = {
  id: "gorup1",
  users: [user1, user2],
};

// entityの塊とidの塊に分ける
const { entities, result } = normalizer(group, groupEntity);
console.log("result", result);
console.log("entities", JSON.stringify(entities, null, 2));

// groupオブジェクトがid: stringの形から戻る
console.log(denormalizer(result, groupEntity, entities));

// groupからuserIDを引いてそれをdenormalizeしてみる
console.log(denormalizer(entities.groups[result].users, [userEntity], entities));
