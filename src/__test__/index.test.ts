import { createEntity, normalize, denormalize, Entity } from "..";
import { schema } from "normalizr";

describe("#createEntity", () => {
  type User = {
    firstName: string;
    lastName: string;
  } & Entity<"users">;

  it("どうにかしてテストを書く", () => {
    expect(1).toEqual(1);
  });
});
