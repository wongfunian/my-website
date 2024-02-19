import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { NextUIProvider } from '@nextui-org/react';
import '@/styles/globals.css';

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <NextUIProvider>
            <main className={`${poppins.variable} ${poppins.className} font-poppins`}>
                <Component {...pageProps} />
            </main>
        </NextUIProvider>
    );
}
