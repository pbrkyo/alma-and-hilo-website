import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { StorySection } from "@/components/story-section"
import { ValuesSection } from "@/components/values-section"
import { ProductsSection } from "@/components/products-section"
import { ProcessSection } from "@/components/process-section"
import { InstagramSection } from "@/components/instagram-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Hebra } from "@/components/hebra"

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Hebra />
      <Header />
      <Hero />
      <StorySection />
      <ValuesSection />
      <ProductsSection />
      <ProcessSection />
      <InstagramSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
