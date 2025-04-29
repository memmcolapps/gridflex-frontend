import Image from "next/image";

interface BrandingProps {
  labelTitle: string;
  label: string;
}
export function Branding({ labelTitle, label }: BrandingProps) {
  return (
    <div>
      <Image
        className="ml-4"
        src="/images/gridflexlogo.jpg"
        alt="Gridflex logo"
        height={320}
        width={320}
        priority
      />

      <div className="w-1/2 mt-5">
        <h1 className="text-4xl font-semibold">{labelTitle}</h1>
        <p className="pt-3 text-lg whitespace-pre-line text-[#6D6D6D]">
          {label}
        </p>
      </div>
    </div>
  );
}
