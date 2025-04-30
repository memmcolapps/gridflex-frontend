import { Manrope } from "next/font/google";

export const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
    // Optional: specify weights you need
    weight: ['400', '500', '700'],
});
export default manrope;