import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { StorySection } from "@/components/story-section"
import { ValuesSection } from "@/components/values-section"
import { ProductsSection } from "@/components/products-section"
import { HowItWorks } from "@/components/how-it-works"
import { ProcessSection } from "@/components/process-section"
import { InstagramSection } from "@/components/instagram-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <StorySection />
      <ValuesSection />
      <ProductsSection />
      <HowItWorks />
      <ProcessSection />
      <InstagramSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
