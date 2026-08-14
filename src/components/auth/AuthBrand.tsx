import Image from "next/image";

export function AuthBrand() {
  return (
    <div>
      <Image
        src="/finance-logo-full.png"
        alt="Finance"
        width={1086}
        height={453}
        priority
        className="h-auto w-64"
      />
      <div className="my-3 h-0.5 w-auto bg-accent" />
      <div className="text-[13px] text-text/55">Seu gestor de finanças.</div>
    </div>
  );
}
