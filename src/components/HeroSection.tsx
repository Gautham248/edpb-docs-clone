import { Book, Shield } from "lucide-react";
import heroBooks from "@/assets/hero-books.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative bg-accent py-16 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBooks})` }}
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Large Icon */}
          <div className="mb-8 flex justify-center">
            <div className="bg-primary-foreground/20 p-8 rounded-full">
              <div className="bg-primary-foreground/20 p-6 rounded-full">
                <Book className="h-16 w-16 text-primary-foreground" />
                <Shield className="h-8 w-8 text-primary-foreground absolute -mt-4 ml-12" />
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-primary-foreground/80 text-sm mb-6">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Our Work & Tools</span>
            <span className="mx-2">›</span>
            <span className="text-primary-foreground">Our documents</span>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;