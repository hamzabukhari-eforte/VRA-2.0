import FixtureCard from "./FixtureCard";

interface Fixture {
  division: string;
  divisionColor: "blue" | "red" | "purple" | "green";
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

interface FixturesCardsProps {
  fixtures?: Fixture[];
}

export default function FixturesCards({
  fixtures = [
    {
      division: "Division 1",
      divisionColor: "blue",
      team1: "VRA 1",
      team2: "ACC",
      date: "Saturday, 15 May",
      time: "14:00",
      venue: "VRA Ground 1",
    },
    {
      division: "Division 2",
      divisionColor: "red",
      team1: "VRA 2",
      team2: "HCC",
      date: "Saturday, 15 May",
      time: "14:00",
      venue: "VRA Ground 2",
    },
    {
      division: "Youth League",
      divisionColor: "purple",
      team1: "VRA U19",
      team2: "Quick",
      date: "Sunday, 16 May",
      time: "10:00",
      venue: "VRA Ground 3",
    },
    {
      division: "Women's League",
      divisionColor: "green",
      team1: "VRA W1",
      team2: "Excelsior",
      date: "Sunday, 16 May",
      time: "14:00",
      venue: "VRA Ground 1",
    },
  ],
}: FixturesCardsProps) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {fixtures.map((fixture, index) => (
          <FixtureCard key={index} {...fixture} />
        ))}
      </div>
    </section>
  );
}

