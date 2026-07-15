import React from"react";
import { Hero} from"@/components/sections/hero";
import { SpecialtiesSection} from"@/components/sections/specialties-section";
import { ExamsSection} from"@/components/sections/exams-section";
import { AboutSection} from"@/components/sections/about-section";
import { LocationSection} from"@/components/sections/location-section";
import { AgreementsSection} from"@/components/sections/agreements-section";
import { TeamSection} from"@/components/sections/team-section";
import { FaqSection} from"@/components/sections/faq-section";

export default function Home() {
 return (
 <>
 <Hero />
 <SpecialtiesSection />
 <ExamsSection />
 <AgreementsSection />
 <AboutSection />
 <TeamSection />
 <FaqSection />
 <LocationSection />
 </>
);
}
