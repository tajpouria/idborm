import IDB from "../lib";

describe("1", () => {
  it("Create objectSores", async () => {
    const TestDB = await IDB.init("TestDB", { name: "JS" });
    const { JS } = TestDB.objectStores;

    expect(JS).toBeDefined();
  });
});
