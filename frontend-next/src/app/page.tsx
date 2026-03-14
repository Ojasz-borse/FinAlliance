import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import InnovationSection from '@/components/InnovationSection';
import DemoSection from '@/components/DemoSection';
import Footer from '@/components/Footer';
import PageBackground from '@/components/PageBackground';

export default function Home() {
  return (
    <>
      <PageBackground />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <InnovationSection />
      <DemoSection />
      <Footer />
    </>
  );
}
