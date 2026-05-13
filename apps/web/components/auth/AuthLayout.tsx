import BackgroundDecor from "./BackgroundDecor";
import LeftShowcase from "./LeftShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
        relative
        h-screen
        overflow-hidden
        bg-[#faf8f8]
        flex
        items-center
        justify-center
        px-6
        lg:px-10
      "
    >

      {/* Background */}
      <BackgroundDecor />

      {/* Main Wrapper */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          flex
          items-center
          justify-between
          gap-10
        "
      >

        {/* Left Side */}
        <LeftShowcase />

        {/* Right Side */}
        <div
          className="
            w-full
            lg:w-[46%]
            relative
            flex
            items-center
            justify-center
          "
        >

          {/* Glow */}
          <div
            className="
              absolute
              inset-0
              rounded-[42px]
              bg-gradient-to-br
              from-red-200
              to-red-50
              blur-xl
              opacity-40
            "
          />

          {/* Card */}
          <div
            className="
              relative
              w-full
              overflow-hidden
              bg-white/90
              backdrop-blur-2xl
              rounded-[40px]
              border
              border-white/50
              shadow-[0_20px_100px_rgba(0,0,0,0.08)]
              p-8
              sm:p-10
              lg:p-12
            "
          >
            {children}
          </div>

        </div>

      </div>

    </main>
  );
}