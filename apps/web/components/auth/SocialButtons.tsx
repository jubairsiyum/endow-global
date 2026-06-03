import Image from "next/image";

export default function SocialButtons() {
  return (
    <div className="mt-4">

      <button
        type="button"
        className="
          w-full
          h-12
          rounded-2xl
          border
          border-slate-200
          bg-white
          backdrop-blur-xl
          shadow-[0_10px_24px_rgba(15,23,42,0.06)]
          flex
          items-center
          justify-center
          gap-3
          text-sm
          font-bold
          text-slate-800
          hover:-translate-y-0.5
          hover:border-slate-300
          hover:shadow-[0_16px_30px_rgba(15,23,42,0.09)]
          transition-all
        "
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={18}
          height={18}
        />

        Continue with Google
      </button>

    </div>
  );
}
