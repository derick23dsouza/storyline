// import { auth } from "@/lib/auth";

// export const handler = auth.handler;


// export { handler as GET, handler as POST };



import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);