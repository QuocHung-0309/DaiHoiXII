// src/components/JourneyTimeline.tsx
"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Trophy, Medal, Users, Rocket, Star } from "lucide-react";

type Item = {
  year: string;
  title: string;
  desc: string;
  icon?: "trophy" | "medal" | "users" | "rocket" | "star";
  colorFrom?: string; // tailwind color like #34d399
  colorTo?: string;
};

const ICONS = {
  trophy: Trophy,
  medal: Medal,
  users: Users,
  rocket: Rocket,
  star: Star,
};

export default function JourneyTimeline({
  items,
  title = "Hành trình & Thành tựu nhiệm kỳ",
  subtitle,
}: {
  items: Item[];
  title?: string;
  subtitle?: string;
}) {
  // progress line parallax
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const lineOpacity = useTransform(progress, [0, 1], [0.2, 0.6]);

  return (
    <section className="py-16 relative">
      {/* background aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </header>

        <div className="relative">
          {/* vertical line */}
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-400/50 via-sky-500/50 to-sky-400/50 md:left-1/2 md:-translate-x-1/2"
            style={{ opacity: lineOpacity }}
          />

          <ol className="space-y-10">
            {items.map((it, idx) => {
              const Icon = ICONS[it.icon ?? "star"];
              const isLeft = idx % 2 === 0;

              // wrapper: mobile = full width; desktop = split
              return (
                <motion.li
                  key={idx}
                  initial={{ y: 24, opacity: 0, scale: 0.98 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start"
                >
                  {/* LEFT SLOT */}
                  <div
                    className={`relative ${isLeft ? "" : "md:order-2"}`}
                  >
                    <Card
                      year={it.year}
                      title={it.title}
                      desc={it.desc}
                      icon={<Icon className="w-5 h-5 text-white" />}
                      colorFrom={it.colorFrom}
                      colorTo={it.colorTo}
                      align={isLeft ? "right" : "left"}
                    />
                  </div>

                  {/* NODE + SPACER */}
                  <div
                    className={`relative md:min-h-[1px] ${
                      isLeft ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    {/* node */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      className="absolute left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-2 h-4 w-4 rounded-full ring-4 ring-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${
                          it.colorFrom ?? "#0EA5E9"
                        }, ${it.colorTo ?? "#22D3EE"})`,
                      }}
                    />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ====== Sub Card ====== */
function Card({
  year,
  title,
  desc,
  icon,
  colorFrom = "#0EA5E9",
  colorTo = "#22D3EE",
  align = "left",
}: {
  year: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  colorFrom?: string;
  colorTo?: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`group relative rounded-2xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all ${
        align === "right" ? "md:ml-auto" : "md:mr-auto"
      }`}
      style={{ maxWidth: 560 }}
    >
      {/* gradient badge */}
      <div
        className="absolute -top-3 left-5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
        style={{
          background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        }}
      >
        {year}
      </div>

      <div className="flex items-start gap-3">
        <div
          className="shrink-0 grid place-items-center h-10 w-10 rounded-xl shadow-md"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
          }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-600 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* hover aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 0%, rgba(56,189,248,0.12), rgba(56,189,248,0))",
        }}
      />
    </div>
  );
}
