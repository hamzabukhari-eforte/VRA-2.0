"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Dumbbell,
  Gift,
  GraduationCap,
  Heart,
  HelpCircle,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Container from "@/components/Container";

const categories = [
  {
    icon: Users,
    title: "Seniors",
    description: "Adult players competing at the highest level with full training and match access.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Young adults in transition with flexible schedules and dedicated support.",
  },
  {
    icon: Sparkles,
    title: "Youth",
    description: "Under 7 to Under 19 pathway with age-appropriate coaching and development.",
  },
  {
    icon: Heart,
    title: "Non-playing Members",
    description: "Stay involved without match commitment while supporting the club community.",
  },
  {
    icon: Gift,
    title: "Donors",
    description: "Support the club's growth and development through your generous contribution.",
  },
];

const pricingData = [
  { category: "Seniors", price: "EUR 450" },
  { category: "Students", price: "EUR 340" },
  { category: "Under 19", price: "EUR 290" },
  { category: "Under 17", price: "EUR 270" },
  { category: "Under 15", price: "EUR 240" },
  { category: "Under 13", price: "EUR 210" },
  { category: "Under 11", price: "EUR 190" },
  { category: "Under 9", price: "EUR 125" },
  { category: "Under 7", price: "EUR 30" },
  { category: "Non-playing member", price: "EUR 210" },
  { category: "Donor", price: "EUR 130" },
];

const benefits = [
  {
    icon: Dumbbell,
    title: "Training",
    description: "Access to all team training sessions (included since 2024).",
  },
  {
    icon: Trophy,
    title: "Matches",
    description: "Participation in matches during the season.",
  },
  {
    icon: Building2,
    title: "Facilities",
    description: "Use of club facilities, including the indoor hall in winter.",
  },
  {
    icon: GraduationCap,
    title: "Coaching",
    description: "Professional coaching and structured development programs.",
  },
];

const requirements = [
  "Payments are managed via ClubCollect (one-time or installments).",
  "Cancellation must be submitted before December 31.",
  "Fees must be paid on time to remain eligible.",
];

const faqs = [
  {
    question: "Can I try cricket before becoming a member?",
    answer: "Yes, trial sessions are welcome. Contact us to schedule your trial.",
  },
  {
    question: "Do I get a discount for a late start?",
    answer: "No, membership is for the full calendar year and non-refundable.",
  },
  {
    question: "Can non-playing members participate in matches?",
    answer: "No, non-playing memberships are for support and involvement without match participation.",
  },
  {
    question: "Can I pay my membership in installments?",
    answer: "Yes, via ClubCollect you can choose one-time payment or installments.",
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const sectionHeadingClass = "text-xl md:text-3xl font-medium";

export function MembershipContent() {
  return (
    <div className="bg-background text-foreground pt-[79px]">
      <section className="py-16 md:py-24">
        <Container className="px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
          >
            <h2 className={`${sectionHeadingClass} mb-6`}>
              Built Around an Active and Engaged Membership
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The association year runs from January 1 to December 31, and memberships renew automatically each year.
              The outdoor cricket season in the Netherlands runs from April to October. Matches take place from May to
              early September. Activities continue in the off-season with winter training in the indoor hall, allowing
              members to stay active year-round.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y border-border dark:border-zinc-700">
        <Container className="px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
            className={`${sectionHeadingClass} mb-10 md:mb-14 text-center`}
          >
            Membership Categories
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border dark:border-zinc-700 bg-card p-6 md:p-7 shadow-sm"
              >
                <category.icon className="w-10 h-10 text-primary dark:text-blue-500 mb-4" />
                <h3 className="text-xl md:text-2xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{category.description}</p>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Elite Training", description: "Professional coaching for all skill levels." },
              { title: "World-Class Facilities", description: "State-of-the-art grounds and indoor training access." },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-border dark:border-zinc-700 bg-card p-8 md:p-10"
              >
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-muted-foreground text-base md:text-lg">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
            className={`${sectionHeadingClass} mb-4 text-center`}
          >
            2026 Contribution Fees
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-10 rounded-2xl border border-border dark:border-zinc-700 bg-card overflow-hidden"
          >
            {pricingData.map((item, index) => (
              <motion.div
                key={item.category}
                whileHover={{ backgroundColor: "var(--muted)" }}
                transition={{ duration: 0.2 }}
                className={`flex justify-between items-center px-5 md:px-8 py-4 md:py-5 ${
                  index < pricingData.length - 1 ? "border-b border-border dark:border-zinc-700" : ""
                }`}
              >
                <span className="text-base md:text-lg text-muted-foreground">{item.category}</span>
                <span className="text-lg md:text-xl font-semibold">{item.price}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-6 rounded-xl border border-border dark:border-zinc-700 bg-muted/50 px-5 py-4 text-center"
          >
            <p className="text-sm md:text-base text-muted-foreground">
              <span className="text-foreground font-medium">Youth match lunch:</span> EUR 59.50 per season (charged
              with membership).
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y border-border dark:border-zinc-700">
        <Container className="px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
            className={`${sectionHeadingClass} mb-12 text-center`}
          >
            What Each Membership Includes
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="text-center rounded-2xl border border-border dark:border-zinc-700 bg-card p-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary dark:text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
            className={`${sectionHeadingClass} mb-12 text-center`}
          >
            Training Overview and Expectations
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-border dark:border-zinc-700 bg-card p-6 md:p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Training Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary dark:text-blue-500 mt-1 shrink-0" />
                  <span className="text-muted-foreground">
                    Weekly training sessions tailored to age and skill level.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary dark:text-blue-500 mt-1 shrink-0" />
                  <span className="text-muted-foreground">Trial sessions are available for new players.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-border dark:border-zinc-700 bg-card p-6 md:p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Requirements</h3>
              <ul className="space-y-4">
                {requirements.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary dark:text-blue-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y border-border dark:border-zinc-700">
        <Container className="px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={sectionReveal}
            className={`${sectionHeadingClass} mb-12 text-center`}
          >
            FAQ and Financial Support
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {faqs.map((faq, index) => (
              <motion.article
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-2xl border border-border dark:border-zinc-700 bg-card p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="w-5 h-5 text-primary dark:text-blue-500 mt-1 shrink-0" />
                  <h3 className="text-lg md:text-xl font-semibold leading-snug">{faq.question}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8">{faq.answer}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-2xl border border-blue-500/30 dark:border-blue-400/35 bg-linear-to-br from-blue-800/20 via-blue-700/12 to-transparent backdrop-blur-md shadow-lg shadow-blue-900/10 p-8 md:p-10 text-center"
          >
            <Heart className="w-12 h-12 text-primary dark:text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">Financial Support Available</h3>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Financial support is available for families through the Youth Fund Sports and Culture via an
              intermediary.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border dark:border-zinc-700 bg-card px-6 py-10 md:p-14 text-center shadow-sm"
          >
            <h2 className={`${sectionHeadingClass} leading-tight mb-6`}>
              Ready to join VRA and be part of our cricket community?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
              We will contact you as soon as possible to confirm your registration. Thank you for your interest.
            </p>
            <Link
              href="/membership-application"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 md:px-8 md:py-4 bg-linear-to-b from-[#155dfc] to-[#0c3796] text-white text-base md:text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Apply Now by Completing the Membership Form
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
