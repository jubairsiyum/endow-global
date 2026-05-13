import {
  Globe,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";

export default function LeftShowcase() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] py-10 pr-20 relative z-10">

      {/* Logo */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          ENDOW
        </h1>

        <p className="text-gray-500 mt-1">
          GLOBAL EDUCATION
        </p>
      </div>

      {/* Main Text */}
      <div>
        <h2 className="text-7xl font-bold leading-[1.1] tracking-tight text-black">
          Your dream
          <span className="block text-red-700">
            university
          </span>
          starts here.
        </h2>

        <p className="mt-8 text-gray-500 text-xl leading-relaxed max-w-xl">
          Get expert guidance, discover global
          courses, and achieve your study abroad
          goals.
        </p>
      </div>

      {/* Features */}
      <div className="flex gap-10">

        <Feature
          icon={<Globe size={28} />}
          title="Global"
          subtitle="Opportunities"
        />

        <Feature
          icon={<MessageCircle size={28} />}
          title="Expert"
          subtitle="Counselors"
        />

        <Feature
          icon={<BadgeCheck size={28} />}
          title="End-to-End"
          subtitle="Support"
        />

      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  subtitle,
}: any) {
  return (
    <div className="flex flex-col items-center text-center">

      <div className="w-16 h-16 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-red-700">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="text-gray-500 text-sm">
        {subtitle}
      </p>

    </div>
  );
}