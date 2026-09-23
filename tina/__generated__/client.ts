import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "ba6042279cda40d534a231b59fcf44bed024713d", queries,  });
export default client;
  