import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: " https://spacexdata.herokuapp.com/graphql",
  documents: "./src/components/**/*.ts",
  generates: {
    "src/generated/graphql.tsx:": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: { withHooks: true },
    },
  },
};

export default config;
