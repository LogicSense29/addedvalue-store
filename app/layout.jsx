import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AuthInit from "@/components/AuthInit";
import "./globals.css";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "AddedValue Hub | Premium Digital Marketplace",
    description: "Discover a curated selection of global innovation. Redefining the digital shopping experience with elevated aesthetics and premium quality essentials.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <Script
                    src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
                    type="module"
                    strategy="afterInteractive"
                />
            </head>
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    <AuthInit>
                        {children}
                    </AuthInit>
                </StoreProvider>
            </body>
        </html>
    );
}
