import { SparklesText } from "@/components/magicui/sparkles-text";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  keywords: [
    "data visualization",
    "database schema",
    "ER diagram",
    "data modeling",
    "database design",
    "schema generator",
    "database schema generator",
    "database generator",
    "revamp database",
  ],
  authors: [{ name: "ziddkh" }],
  openGraph: {
    title: "Dataloom - Create and Share Data Visualizations",
    description: "Generate beautiful database schemas and ER diagrams with our intuitive tools.",
    url: "https://dataloom.com",
    siteName: "Dataloom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dataloom - Data Visualization Platform"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dataloom - Create and Share Data Visualizations",
    description: "Generate beautiful database schemas and ER diagrams with our intuitive tools.",
    images: ["/og-image.jpg"],
    creator: "@dataloom"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  // verification: {
  //   google: "your-google-site-verification",
  //   other: {
  //     me: ["your-personal-domain"],
  //   },
  // },
  alternates: {
    canonical: "https://dataloom.com",
    languages: {
      "en-US": "https://dataloom.com",
    },
  },
};

export default function Home() {
  return (
    <>
      {/* Navbar Section */}
      <header className="sticky top-0 h-12 bg-background/60 backdrop-blur w-full z-50">
        <nav className="max-w-[988px] mx-auto py-2 px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Dataloom
            </Link>
            <Button size="sm" variant="outline" asChild>
              <Link href="/">Get Started</Link>
            </Button>
          </div>
        </nav>
        <Separator />
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-background max-w-[988px] mx-auto border-x border-border">
          <div className="px-10 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
              <article>
                <SparklesText
                  sparklesCount={5}
                  colors={{
                    first: "var(--color-primary)",
                    second: "var(--color-destructive)",
                  }}
                >
                  <h1 className="text-5xl font-bold">Dataloom</h1>
                </SparklesText>
                <p className="text-muted-foreground mt-2 text-lg">
                  Dataloom is a platform for creating and sharing data
                  visualizations.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/">Start Prompting</Link>
                </Button>
                <p className="text-muted-foreground text-xs mt-2">
                  No credit card required
                </p>
              </article>
              <figure className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[500px] h-[500px] bg-primary rounded-lg"></div>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* Prompt Action Section */}
        <section className="bg-background max-w-[988px] mx-auto border-x border-t border-border">
          <div className="p-4">
            <Textarea
              className="w-full resize-none"
              placeholder="Ask me anything..."
              rows={2}
            />
            <div className="flex justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                Generate a database from your data
              </span>
              <Button className="size-10">
                <ArrowUp className="w-4 h-4" />
                <span className="sr-only">Generate Database</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Hero Image Showcases Section */}
        <section className="bg-background max-w-[988px] mx-auto border-x border-border">
          <div className="px-4 pb-4">
            <figure className="w-full aspect-video bg-muted rounded-lg"></figure>
          </div>
        </section>

        {/* Showcases/Features Section */}
        <section className="bg-background max-w-[988px] mx-auto border-x border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <aside className="md:col-span-2 p-4 flex md:flex-col gap-4 md:border-r border-border overflow-x-auto">
              {/* Tabs */}
              <button className="cursor-pointer shrink-0 w-64 md:w-full p-4 border border-border rounded-md flex flex-col gap-1 bg-background hover:bg-secondary/30 transition-colors">
                <p className="text-left font-bold">ER Diagram</p>
                <p className="text-left text-sm text-muted-foreground">
                  Generate an ER diagram from your database schema.
                </p>
              </button>
              <button className="cursor-pointer shrink-0 w-64 md:w-full p-4 border border-border rounded-md flex flex-col gap-1 bg-background hover:bg-secondary/30 transition-colors">
                <p className="text-left font-bold">Suggestions</p>
                <p className="text-left text-sm text-muted-foreground">
                  Get suggestions for your database schema.
                </p>
              </button>
              <button className="cursor-pointer shrink-0 w-64 md:w-full p-4 border border-border rounded-md flex flex-col gap-1 bg-background hover:bg-secondary/30 transition-colors">
                <p className="text-left font-bold">Exportable</p>
                <p className="text-left text-sm text-muted-foreground">
                  Export your database schema to a variety of formats.
                </p>
              </button>
            </aside>
            <div className="col-span-1 md:col-span-3">
              <div className="p-4 h-full">
                <figure className="w-full h-full bg-muted rounded-lg"></figure>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section (Sign Up) */}
        <section className="bg-gradient-to-b from-background to-zinc-100 dark:to-zinc-900 max-w-[988px] mx-auto border-x border-t border-border">
          <div className="px-4 py-10 text-center">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Sign up for a free account and start generating database schemas.
            </p>
            <Button className="mt-6">Sign Up</Button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="max-w-[988px] mx-auto">
        <div className="px-4 py-10 text-center">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Dataloom
            </Link>

            {/* Social Media Links */}
            <nav className="flex items-center gap-3">
              <Link href="/">
                <SiX className="w-4 h-4 hover:text-primary transition-colors" />
              </Link>
              <Link href="/">
                <SiGithub className="w-4.5 h-4.5 hover:text-primary transition-colors" />
              </Link>
            </nav>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} Dataloom. All rights reserved.
          </p>
          <nav className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <Link href="/">Terms of Service</Link>
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Get Started</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
