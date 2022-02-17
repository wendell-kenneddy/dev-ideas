import type { AppProps } from 'next/app';

import { SessionProvider } from 'next-auth/react';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ToastContainer } from 'react-toastify';

import { queryClient } from '../lib/queryClient';

import { Header } from '../components/Header';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Header />

        <Component {...pageProps} />

        <ToastContainer />

        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </SessionProvider>
  );
}
