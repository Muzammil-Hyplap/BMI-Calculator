import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/overview/index.tsx"),
    route("/sign-in", 'routes/auth/sign-in.tsx'),
    route("/sign-up", 'routes/auth/sign-up.tsx'),
] satisfies RouteConfig;
