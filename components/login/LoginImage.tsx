import Image from "next/image";

export default function LoginImage() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative">
      <Image
        src="/assets/542-19188.webp"
        alt="Cricket Ball"
        width={800}
        height={1200}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

