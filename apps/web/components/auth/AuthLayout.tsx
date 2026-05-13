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
        min-h-screen
        overflow-hidden
        bg-[#f8f6f6]
        flex
        items-center
        justify-center
        px-6
        lg:px-10
      "
    >

      {/* Background */}
      <BackgroundDecor />

      {/* Blur Glow */}
      <div
        className="
          absolute
          top-[-200px]
          right-[-100px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-red-200/40
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-250px]
          left-[-150px]
          w-[450px]
          h-[450px]
          rounded-full
          bg-red-100/40
          blur-3xl
        "
      />

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
          "
        >

          {/* Glass Card */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[36px]
              border
              border-white/40
              bg-white/65
              backdrop-blur-2xl
              shadow-[0_20px_80px_rgba(0,0,0,0.08)]
              p-10
              lg:p-12
            "
          >

            {/* Inner Glow */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-white/40
                to-transparent
                pointer-events-none
              "
            />

            <div className="relative z-10">
              {children}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}