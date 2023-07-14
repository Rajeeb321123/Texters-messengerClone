// this middleware usefull to no allow user to go to certain page if they arenot logged in

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = { 
  matcher: [
    "/conversations/:path*",
    "/users/:path*",
  ]
};