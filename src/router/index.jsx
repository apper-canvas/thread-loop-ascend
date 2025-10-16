import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const PostDetail = lazy(() => import("@/components/pages/PostDetail"));
const Community = lazy(() => import("@/components/pages/Community"));
const Search = lazy(() => import("@/components/pages/Search"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "post/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <PostDetail />
      </Suspense>
    )
  },
  {
    path: "r/:communityId",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Community />
      </Suspense>
    )
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Search />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);