import Link from "next/link";

const cards = [
  { href: "/admin/sections", title: "Section images", description: "Shared ImageTextSection images (Overseas Talent, Sports Clinics, Culture, Mission, Vision, Volunteer, Grounds)" },
  { href: "/admin/homepage", title: "Homepage", description: "Photo gallery, Crowd section, VRA Teams, Our Sponsors" },
  { href: "/admin/about", title: "About", description: "Vision, Mission, Volunteer images; Our Board members" },
  { href: "/admin/vra-cricket", title: "VRA Cricket", description: "Team counts, section images, Facility carousel" },
  { href: "/admin/submissions", title: "Submissions", description: "Contact, Membership, Termination, Donation, Net booking" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
        Dashboard
      </h1>
      <p className="text-zinc-600 mb-8 text-base">
        Manage dynamic content and view form submissions. Changes update the live site with fallbacks when empty.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-5 rounded-lg border border-zinc-200 bg-white hover:border-blue-500 transition-colors"
          >
            <h2 className="text-lg font-medium text-zinc-900">
              {card.title}
            </h2>
            <p className="text-zinc-500 mt-1 text-base">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
