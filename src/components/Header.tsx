import { ChevronDown, Search, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import edpbLogo from "@/assets/edpb-logo.png";

const Header = () => {
  return (
    <header className="w-full">
      {/* EU Official Banner */}
      <div className="bg-primary-dark text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
              <span className="text-blue-800 text-xs font-bold">EU</span>
            </div>
            <span>An official website of the European Union</span>
          </div>
          <button className="text-sm flex items-center gap-1 hover:text-blue-200 transition-colors">
            How do you know?
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-4">
              <img 
                src={edpbLogo} 
                alt="European Data Protection Board" 
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-xl font-semibold">European Data Protection Board</h1>
              </div>
            </Link>

            {/* Language Selector */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-primary-dark px-3 py-2 rounded text-sm hover:bg-opacity-80 transition-colors">
                <Globe className="h-4 w-4" />
                EN
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-primary border-t border-primary-foreground/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="flex items-center">
                <li>
                  <button className="flex items-center gap-1 px-6 py-4 text-sm font-medium hover:bg-primary-dark transition-colors">
                    ABOUT EDPB
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-1 px-6 py-4 text-sm font-medium hover:bg-primary-dark transition-colors">
                    OUR WORK & TOOLS
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-1 px-6 py-4 text-sm font-medium hover:bg-primary-dark transition-colors">
                    NEWS
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-1 px-6 py-4 text-sm font-medium hover:bg-primary-dark transition-colors">
                    CSC
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </li>
              </ul>
              
              <button className="p-2 hover:bg-primary-dark rounded transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;