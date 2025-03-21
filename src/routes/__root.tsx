import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { init, mockTelegramEnv } from "@telegram-apps/sdk";
import { useEffect } from "react";
import { AuthProvider } from "~/lib/components/AuthProvider";
import appCss from "~/lib/styles/app.css?url";

// const getUser = createServerFn({ method: "GET" }).handler(async () => {
//   const { headers } = getWebRequest()!;
//   const session = await auth.api.getSession({ headers });

//   return session?.user || null;
// });

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  // user: Awaited<ReturnType<typeof getUser>>;
}>()({
  // beforeLoad: async ({ context }) => {
  //   const user = await context.queryClient.fetchQuery({
  //     queryKey: ["user"],
  //     queryFn: ({ signal }) => getUser({ signal }),
  //   }); // we're using react-query for caching, see router.tsx
  //   return { user };
  // },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStarter",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  ssr: false,
});

function RootComponent() {
  useEffect(() => {
    const themeParams = {
      accent_text_color: "#6ab2f2",
      bg_color: "#17212b",
      button_color: "#5288c1",
      button_text_color: "#ffffff",
      destructive_text_color: "#ec3942",
      header_bg_color: "#17212b",
      hint_color: "#708499",
      link_color: "#6ab3f3",
      secondary_bg_color: "#232e3c",
      section_bg_color: "#17212b",
      section_header_text_color: "#6ab3f3",
      subtitle_text_color: "#708499",
      text_color: "#f5f5f5",
    } as const;

    if (import.meta.env.DEV) {
      mockTelegramEnv({
        launchParams: {
          tgWebAppPlatform: "web",
          tgWebAppVersion: "1.0.0",
          tgWebAppData: import.meta.env.VITE_MOCK_INIT_DATA,
          tgWebAppThemeParams: themeParams,
        },
      });
    }

    init();
  }, []);
  return (
    <RootDocument>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce> */}

        {children}

        <Scripts />
      </body>
    </html>
  );
}
