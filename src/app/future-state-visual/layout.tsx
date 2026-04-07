import {
  Inter,
  Lora,
  Merriweather,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Roboto,
  Source_Serif_4,
} from "next/font/google";
import type { ReactNode } from "react";

const fontInter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-inter",
});

const fontOpenSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-open-sans",
});

const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-wf-roboto",
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-poppins",
});

const fontLora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-lora",
});

const fontMerriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-wf-merriweather",
});

const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-playfair",
});

const fontSourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-wf-source-serif-4",
});

export default function FutureStateVisualLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fontInter.variable} ${fontOpenSans.variable} ${fontRoboto.variable} ${fontPoppins.variable} ${fontLora.variable} ${fontMerriweather.variable} ${fontPlayfair.variable} ${fontSourceSerif4.variable}`}
    >
      {children}
    </div>
  );
}
