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
        w-full
        overflow-hidden
        bg-[#f8f6f6]
        flex
        items-center
        justify-center
      "
    >

      {/* Background - Full Viewport Coverage */}
      <BackgroundDecor />

      {/* Blur Glow - Top Right */}
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
          pointer-events-none
          sm:w-[400px]
          sm:h-[400px]
          lg:w-[500px]
          lg:h-[500px]
        "
      />

      {/* Blur Glow - Bottom Left */}
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
          pointer-events-none
          sm:w-[350px]
          sm:h-[350px]
          lg:w-[450px]
          lg:h-[450px]
        "
      />

      {/* Main Wrapper - Responsive with Padding */}
      <div
        className="
          relative
          z-10
          w-full
          h-full
          max-w-6xl
          flex
          flex-col
          lg:flex-row
          items-center
          justify-between
          gap-3
          sm:gap-4
          lg:gap-6
          px-4
          sm:px-6
          md:px-8
          lg:px-8
        "
      >

        {/* Left Side */}
        <LeftShowcase />

        {/* Right Side - Responsive Form Container */}
        <div
          className="
            w-full
            sm:w-full
            md:w-full
            lg:w-[46%]
            relative
            flex
            items-center
            justify-center
            min-h-screen
            lg:min-h-0
          "
        >

          {/* Glass Card - Responsive */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              sm:rounded-3xl
              lg:rounded-3xl
              border
              border-white/40
              bg-white/55
              backdrop-blur-[30px]
              shadow-[0_20px_80px_rgba(0,0,0,0.08)]
              p-4
              sm:p-5
              md:p-6
              lg:p-7
              w-full
              max-w-sm
              sm:max-w-sm
              lg:max-w-sm
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