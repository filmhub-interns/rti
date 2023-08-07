import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { Open_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const openSans = Open_Sans({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

const theme = extendTheme({
  fonts: {
    body: openSans.style.fontFamily,
    heading: openSans.style.fontFamily,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
