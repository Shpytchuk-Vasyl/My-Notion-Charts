// Compile-time guard: the inferred input type of updateChart must be a valid (deep) partial of Type.
// If Type's shape changes or the schema drifts, this fails to compile — fix one or the other.
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> | null }
    : T;

export type AssertDeepPartial<Schema, Type> =
  Schema extends DeepPartial<Type>
    ? true
    : {
        error: "Input schema is not a valid partial of Type";
        schema: Schema;
        type: Type;
      };

// Example: of usage
// type InferSchema = z.infer<typeof SomeSchema>;
// type _Assert = AssertDeepPartial<InferSchema, Type>;
// const _assert: _Assert = true as _Assert;
