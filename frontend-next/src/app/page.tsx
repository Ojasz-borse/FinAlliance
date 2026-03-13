import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import UsersSection from '@/components/UsersSection';
import SolutionSection from '@/components/SolutionSection';
import ArchitectureSection from '@/components/ArchitectureSection';
import AIModelsSection from '@/components/AIModelsSection';
import InnovationSection from '@/components/InnovationSection';
import ResponsibleAISection from '@/components/ResponsibleAISection';
import DemoSection from '@/components/DemoSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <UsersSection />
      <SolutionSection />
      <ArchitectureSection />
      <AIModelsSection />
      <InnovationSection />
      <ResponsibleAISection />
      <DemoSection />
      <Footer />
    </>
  );
}
