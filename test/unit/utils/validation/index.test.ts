import { validate } from "@/utils/validation";
import * as yup from "yup";

describe("validate", () => {
  it("should return an object with result", async () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    const { result, error } = await validate(schema, { name: "John" });

    expect(result).toEqual({ name: "John" });
    expect(error).toBeNull();
  });

  it("should return an object with error", async () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    const { result, error } = await validate(schema, {});

    expect(result).toBeNull();
    expect(error).toBeInstanceOf(yup.ValidationError);
  });
});
