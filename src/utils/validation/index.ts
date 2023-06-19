import * as yup from "yup";

export async function validate<T>(schema: yup.Schema<T>, data: any): Promise<{ result: T | null; error: yup.ValidationError | null }> {
  try {
    const result = await schema.validate(data);

    return { result, error: null };
  } catch (e) {
    return { result: null, error: e as yup.ValidationError };
  }
}
