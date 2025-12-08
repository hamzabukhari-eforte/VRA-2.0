export default function ContactForm() {
  return (
    <section className="w-full max-w-[800px] mx-auto">
      <h2 className="text-foreground dark:text-white text-[32px] font-normal  text-center mb-12">
        &quot;Have something that we can collaborate on at our
        facility?&quot;
      </h2>

      <form className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-foreground/70 dark:text-white/70 text-sm font-normal ">
              First Name
            </label>
            <input
              type="text"
              placeholder="Insert your first name"
              className="bg-transparent border-b border-foreground/20 dark:border-white/20 py-3 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:border-foreground/50 dark:focus:border-white/50 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-foreground/70 dark:text-white/70 text-sm font-normal ">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Insert Last Name"
              className="bg-transparent border-b border-foreground/20 dark:border-white/20 py-3 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:border-foreground/50 dark:focus:border-white/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-foreground/70 dark:text-white/70 text-sm font-normal ">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Add your E-mail"
            className="bg-transparent border-b border-foreground/20 dark:border-white/20 py-3 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:border-foreground/50 dark:focus:border-white/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-foreground/70 dark:text-white/70 text-sm font-normal ">
            Phone number (optional)
          </label>
          <input
            type="tel"
            placeholder="Insert Name"
            className="bg-transparent border-b border-foreground/20 dark:border-white/20 py-3 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:border-foreground/50 dark:focus:border-white/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-foreground/70 dark:text-white/70 text-sm font-normal ">
            Message
          </label>
          <textarea
            placeholder="Type your message"
            rows={6}
            className="bg-transparent border-b border-foreground/20 dark:border-white/20 py-3 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:border-foreground/50 dark:focus:border-white/50 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="self-center px-12 py-4 bg-foreground dark:bg-white text-background dark:text-black rounded-lg hover:bg-foreground/90 dark:hover:bg-white/90 transition-colors mt-6"
        >
          <span className="text-lg font-medium font-['Roboto']">
            Submit
          </span>
        </button>
      </form>
    </section>
  );
}

