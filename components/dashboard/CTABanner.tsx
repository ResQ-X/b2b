"use client";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function CTABanner({
  title,
  desc,
  buttonText,
  illustration,
  onAction,
}: {
  title: string;
  desc: string;
  buttonText: string;
  illustration: string;
  onAction?: () => void;
}) {
  // Replace "|" with <br /> elements
  const formatDesc = (text: string) =>
    text.split("|").map((part, idx) => (
      <span key={idx}>
        {part.trim()}
        {idx < text.split("|").length - 1 && <br />}
      </span>
    ));

  return (
    <div className="rounded-2xl bg-[#3B3835] text-white p-6 flex items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-semibold text-[#FFFFFF]">{title}</h3>
        <p className="text-sm font-medium mt-[16px] mb-6">{formatDesc(desc)}</p>

        <Button
          variant="orange"
          onClick={onAction}
          className="w-[180px] lg:w-[262px] h-[58px] lg:h-[60px]"
        >
          {buttonText}
        </Button>
      </div>
      <Image
        src={illustration}
        width={350}
        height={150}
        alt="cta"
        className="hidden sm:block"
      />
    </div>
  );
}
