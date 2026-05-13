import Image from "next/image";

export default function SocialButtons() {
  return (
    <div className="mt-6">

      {/* Google Button */}
      <button
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-gray-200
          bg-white
          flex
          items-center
          justify-center
          gap-3
          font-semibold
          text-gray-800
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-0.5
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