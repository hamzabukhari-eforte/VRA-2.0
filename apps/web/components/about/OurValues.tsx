import {
  Award,
  Users,
  Shield,
  TrendingUp,
  Leaf,
  Zap,
  LucideIcon,
} from "lucide-react";

interface Value {
  Icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const values: Value[] = [
  {
    Icon: Award,
    title: "Excellence",
    description:
      "Striving for the highest standards in all aspects of the club, from on-field performance to off-field operations.",
    gradient: "from-white/80 to-yellow-600",
  },
  {
    Icon: Users,
    title: "Community",
    description:
      "Fostering a strong, inclusive community where members feel valued and connected.",
    gradient: "from-white/80 to-blue-600",
  },
  {
    Icon: Shield,
    title: "Integrity",
    description:
      "Upholding honesty, transparency, and respect in all interactions.",
    gradient: "from-white/80 to-purple-600",
  },
  {
    Icon: TrendingUp,
    title: "Development",
    description:
      "Committing to the growth and development of players at all levels.",
    gradient: "from-white/80 to-green-600",
  },
  {
    Icon: Leaf,
    title: "Sustainability",
    description:
      "Ensuring the club's financial health and long-term success.",
    gradient: "from-white/80 to-emerald-600",
  },
  {
    Icon: Zap,
    title: "Empowering",
    description:
      "Creating an environment where all members are encouraged to reach their full potential.",
    gradient: "from-white/80 to-orange-600",
  },
];

export default function OurValues() {
  return (
    <section className="w-full flex flex-col items-center gap-12">
      <h2 className="text-foreground dark:text-white text-[32px] font-medium">Our Values</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
        {values.map((value, index) => {
          const IconComponent = value.Icon;
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28">
                {/* Glowing gradient div positioned behind */}
                <div className="absolute inset-0 flex items-center justify-center top-4 left-4">
                  <div
                    className={`w-18 h-18 bg-linear-to-br ${value.gradient} rounded-2xl shadow-2xl`}
                  />
                </div>
                {/* Glass effect container with backdrop blur - overlays the gradient */}
                <div className="absolute inset-0 top-10 left-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-foreground dark:text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-foreground dark:text-white text-xl md:text-3xl font-medium">{value.title}</h3>
              <p className="text-foreground/70 dark:text-white/70 text-sm md:text-lg font-normal text-center leading-relaxed">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

