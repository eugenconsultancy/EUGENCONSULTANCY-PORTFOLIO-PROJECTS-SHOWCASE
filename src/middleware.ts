import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // No additional logic needed
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow unauthenticated access to the login page
                if (req.nextUrl.pathname === "/admin/login") {
                    return true;
                }
                return !!token;
            },
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};