import Image from "next/image";

export default function SocialButtons() {
  return (
    <div className="mt-6">

      <button
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-white/60
          bg-white/70
          backdrop-blur-xl
          shadow-sm
          flex
          items-center
          justify-center
          gap-3
          font-semibold
          text-gray-800
          hover:shadow-md
          transition-all
        "
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={22}
          height={22}
        />

        Continue with Google
      </button>

    </div>
  );
}