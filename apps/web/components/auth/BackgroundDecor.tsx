export default function BackgroundDecor() {
  return (
    <>

      {/* Top Right Glow */}
      <div
        className="
          absolute
          top-[-250px]
          right-[-150px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-red-700
          opacity-20
          blur-3xl
        "
      />

      {/* Bottom Left Glow */}
      <div
        className="
          absolute
          bottom-[-250px]
          left-[-200px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-red-500
          opacity-20
          blur-3xl
        "
      />

      {/* Center Soft Glow */}
      <div
        className="
          absolute
          top-[30%]
          left-[35%]
          w-[300px]
          h-[300px]
          rounded-full
          bg-red-200
          opacity-20
          blur-3xl
        "
      />

      {/* Dot Pattern */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          bg-[radial-gradient(#000_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

    </>
  );
}