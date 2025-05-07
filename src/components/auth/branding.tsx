import Image from "next/image";

interface BrandingProps {
  labelTitle: string;
  label: string;
}

export function Branding({ labelTitle, label }: BrandingProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-16">
        <Image
          src="/images/gridflexlogo.jpg"
          alt="Gridflex logo"
          height={200}
          width={200}
          priority
          className="mb-2"
        />
      </div>

      <div className="max-w-md">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">{labelTitle}</h1>
        <p className="text-lg leading-relaxed text-gray-600">{label}</p>
      </div>
    </div>
  );
}
