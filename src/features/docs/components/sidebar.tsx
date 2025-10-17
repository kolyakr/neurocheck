"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  { href: "/docs#overview", label: "Overview" },
  { href: "/docs#depression", label: "Depression" },
  { href: "/docs#mecfs", label: "ME/CFS" },
  { href: "/docs#both", label: "Comorbidity" },
  { href: "/docs#history", label: "History & Tracking" },
  { href: "/docs#facts", label: "Facts & FAQ" },
];

export default function DocsSidebar() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    // Set initial active section based on URL hash
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActive(hash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that's most visible
        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target.id;
          }
        });

        if (mostVisible) {
          setActive(mostVisible);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    // Observe all sections
    sections.forEach((s) => {
      const id = s.href.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActive(hash);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleClick = (href: string) => {
    const id = href.split("#")[1];
    setActive(id);

    // Smooth scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-full sm:w-64 shrink-0">
      <div className="sticky top-20 rounded-lg border bg-white shadow-sm">
        <nav className="p-4 space-y-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contents</h3>
          {sections.map((s) => {
            const id = s.href.split("#")[1];
            return (
              <button
                key={s.href}
                onClick={() => handleClick(s.href)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100 ${
                  active === id
                    ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500"
                    : "text-gray-700"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
