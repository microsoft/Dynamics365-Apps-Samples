const expect = chai.expect;

describe("CheckForSuggestions", () => {
  describe("execution", () => {
    it("should complete successfully", () => {

      let a: number = 100;
      expect(a).equals(100, "this is the expected value");
    });

    it("should not happen when form type is create", () => {

      let a: number = 200;
      expect(a).equals(200, "this is the expected value");
    });
  })

});