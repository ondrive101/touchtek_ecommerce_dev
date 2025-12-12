import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import AuthProvider from "@/provider/auth.provider";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async  function RootLayout({ children, params }) {

const { lang } = await params;
const initialTheme = "light";


  return (
    <html lang={lang} className={initialTheme} style={{ colorScheme: initialTheme }}>
      <body className={inter.className}>
        <Providers>
          <DirectionProvider lang={lang}>
            <ClientProviders>
              {children}
            </ClientProviders>
          </DirectionProvider>
        </Providers>
      </body>
    </html>
  );
}
function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <TanstackProvider>
        {children}
      </TanstackProvider>
    </AuthProvider>
  );
}
ClientProviders.displayName = 'ClientProviders';