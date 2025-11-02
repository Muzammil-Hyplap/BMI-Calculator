import { isRouteErrorResponse, Links, Meta, Outlet, redirect, Scripts } from "react-router";
import type { Route } from "./+types/root";
import { createTheme } from "./styles/theme/create-theme";
import { ThemeProvider } from "@mui/material/styles";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function HydrateFallback() {
    return;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const theme = createTheme();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body style={{ margin: 0 }}>
                <ThemeProvider theme={theme} disableTransitionOnChange defaultMode="light">
                    {children}
                </ThemeProvider>
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}

export const authMiddleware: Route.ClientMiddlewareFunction = async function ({ context, request }, next) {
    const res = await (
        await fetch(import.meta.env.VITE_API_URL + "/user", {
            credentials: "include",
        })
    ).json();

    const guestRoutes = ["sign-in", "sign-up"];
    let suffix: string | string[] = request.url.split("/");
    suffix = suffix[suffix.length - 1];

    if (res?.success) {

        if (guestRoutes.includes(suffix)) {
            throw redirect('/');
        }

        return next();
    }

    if (guestRoutes.includes(suffix)) {
        return next();
    }

    throw redirect("/sign-in");
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [authMiddleware];
