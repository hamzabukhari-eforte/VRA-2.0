export default function BePartOfUs() {
  return (
    <section className="w-full flex flex-col items-center gap-6 py-12">
      <h2 className="text-foreground dark:text-white text-xl md:text-3xl font-medium ">
        Be a part of Us!
      </h2>
      <p className="text-foreground/70 dark:text-white/70 text-base font-normal  text-center max-w-[600px]">
      Join our Volunteer team today.
      </p>
      <button className="px-8 py-3 bg-transparent rounded-lg border border-foreground/20 dark:border-white flex items-center justify-center gap-2.5 hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors">
        <span className="text-foreground dark:text-white text-base font-normal">
          Apply
        </span>
      </button>
    </section>
  );
}

