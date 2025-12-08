import {
  Lightbulb,
  TrendingUp,
  Key,
  Users,
  Target,
  Smile,
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
    Icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace change and continuously seek new ways to improve and evolve our organization.",
    gradient: "from-white/80 to-yellow-600",
  },
  {
    Icon: TrendingUp,
    title: "Growth",
    description:
      "We are committed to the personal and professional development of our members and staff.",
    gradient: "from-white/80 to-green-600",
  },
  {
    Icon: Key,
    title: "Ownership",
    description:
      "We take responsibility for our actions and decisions, and we hold ourselves accountable.",
    gradient: "from-white/80 to-purple-600",
  },
  {
    Icon: Users,
    title: "Team Work",
    description:
      "We believe in the power of collaboration and working together towards common goals.",
    gradient: "from-white/80 to-orange-600",
  },
  {
    Icon: Target,
    title: "Commitment",
    description:
      "We are dedicated to our mission and to the success of our organization and members.",
    gradient: "from-white/80 to-red-600",
  },
  {
    Icon: Smile,
    title: "Positivity",
    description:
      "We maintain an optimistic outlook and create a supportive environment for everyone.",
    gradient: "from-white/80 to-green-600",
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

