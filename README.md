# normalizr+TS

## functions
- createEntity
- normalizer
- denormalizer

### createEntity
Genericに代入されたTの型から紐づくエンティティを要求し、新しいエンティティを作成する関数

```typescript
const createEntity = <T extends BaseSchema>(
  entityName: string,
  relatedEntities: RelatedEntities<T>,
): schema.Entity<T> => new schema.Entity<T>(entityName, relatedEntities);
```

### normalizer
型がガバガバだったので型付けただけのラッパー

```typescript
export const normalizer = <T>(data: T, schema: Schema<T>): NormalizedSchema<Entities, Result<T>> =>
  normalize<T, Entities, Result<T>>(data, schema);
```

### denormalizer
dataをセットすると代入するべきschemaを要求する関数.idとentitiesからもとのオブジェクトを逆引きする


```typescript
export const denormalizer = <D extends NestArray<string>, S, T extends Entities>(
  data: D,
  schema: Entity<D, S>,
  entities: T,
): Denormalized<D, S> => denormalize(data, schema, entities);

```

## usage

### Create Entity
`src/entities`以下を見てください

```typescript
import { IUser, userEntity } from "./user";
import { createEntity } from "../normalizer";

export type IGroup = {
  id: string;
  users: IUser[];
};

// IGroupに含まれるprimitiveでない型をEntityとして定義する.
// しないと型エラーが出るようになってる
export const groupEntity = createEntity<IGroup>("groups", { users: [userEntity] });
```

### Normalize
```typescript
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


const { entities, result } = normalizer(group, groupEntity);
// entityの塊とidの塊に分ける
console.log("result", result);
console.log("entities", JSON.stringify(entities, null, 2));
```

### Denormalize

```typescript
const { entities, result } = normalizer(group, groupEntity);
// groupオブジェクトがid: stringの形から戻る
console.log(denormalizer(result, groupEntity, entities));
// groupからuserIDを引いてそれをdenormalizeしてみる
console.log(denormalizer(entities.groups[result].users, [userEntity], entities));
```