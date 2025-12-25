import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Video,
  Wand2,
  Mic,
  Zap,
  FileVideo,
  MessageSquare,
  Check,
  Sparkles,
  PlayCircle,
  Upload,
  Stars,
  Share2,
  Globe,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Video className="size-4 text-white" />
            </div>
            <span className="font-bold text-xl">Clueso</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
              Use Cases
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#customers" className="text-muted-foreground hover:text-foreground transition-colors">
              Customers
            </Link>
          </nav>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/auth/sign-up">Start Free Trial</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32 flex flex-col items-center text-center gap-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl">
          <span className="text-balance leading-tight">Product videos</span>
          <br />
          <span className="text-balance leading-tight">in minutes with AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl text-balance leading-relaxed">
          Transform raw screen recordings into stunning videos & documentation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            size="lg"
            className="text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-12 px-8"
            asChild
          >
            <Link href="/auth/sign-up">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-transparent" asChild>
            <Link href="#demo">Book a Demo</Link>
          </Button>
        </div>

        {/* Video Comparison */}
        <div className="mt-16 w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Rough Recording</p>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 border-2 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-background/50 backdrop-blur">
                    <Video className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Raw screen recording</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                With Clueso
              </p>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/30 dark:to-indigo-950/30 border-2 border-violet-200 dark:border-violet-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10" />
                <div className="text-center space-y-2 relative z-10">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">
                    <Sparkles className="size-8 text-white" />
                  </div>
                  <p className="text-sm font-medium">Professional video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container py-8 border-y bg-muted/30">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Backed by</p>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">Y Combinator</div>
              <div className="text-lg font-semibold">Sequoia</div>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden md:block" />
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Stars key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">4.9</span>
            </div>
            <p className="text-sm text-muted-foreground">Rated on G2.com</p>
          </div>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="container py-16 md:py-20">
        <Card className="border-2 bg-gradient-to-br from-background to-muted/30 max-w-4xl mx-auto">
          <CardContent className="pt-12 pb-12">
            <blockquote className="text-2xl md:text-3xl font-medium text-center mb-8 text-balance leading-relaxed">
              "Clueso has empowered our Product team to produce high-quality videos & training content 20x faster"
            </blockquote>
            <div className="flex flex-col items-center gap-3">
              <div className="size-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600" />
              <div className="text-center">
                <p className="font-semibold">Sean O'Donnell</p>
                <p className="text-sm text-muted-foreground">Director of Product Management, Phenom</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI Features Section */}
      <section id="features" className="container py-16 md:py-24 bg-muted/20">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-sm font-medium mb-6">
            <Sparkles className="size-4" />
            CRAFTED WITH AI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Major video edits, automated.</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance mb-16">
            AI does the heavy-lifting. The final touches are all yours – everything is customizable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <Wand2 className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Perfect Video Scripts</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI removes filler words and rewrites your script clearly and concisely, perfectly matching your brand
                voice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <Mic className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lifelike AI Voiceovers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your recorded audio is swapped with AI voiceovers that sound impressively professional and realistic.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <Zap className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Auto-Zooms</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI automatically zooms into key actions, highlighting exactly what viewers need to see.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <MessageSquare className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful Captions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly engage your viewers with eye-catching, AI-generated captions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <FileVideo className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto-Generated SOPs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Clear, step-by-step documentation magically created from your videos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 mb-5">
                <Sparkles className="size-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Branded Video Templates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Keep your videos consistently on brand with themed intros, outros, and backgrounds.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Clueso is Built For You</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explaining software is hard. Clueso makes it easy.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              "Customer Education",
              "Product Marketing",
              "Learning & Development",
              "Sales Enablement",
              "Product Management",
              "IT Change Management",
              "Customer Success/Support",
              "Engineering",
            ].map((useCase) => (
              <Button
                key={useCase}
                variant="outline"
                className="h-auto py-4 px-4 text-left justify-start bg-background hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-200 dark:hover:border-violet-900 transition-all"
              >
                {useCase}
              </Button>
            ))}
          </div>

          <div className="aspect-video rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/30 dark:to-indigo-950/30 border-2 border-violet-200 dark:border-violet-900 flex items-center justify-center">
            <div className="text-center space-y-4">
              <PlayCircle className="size-20 mx-auto text-violet-600" />
              <p className="text-lg font-medium">Demo Video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Translation Section */}
      <section className="container py-16 md:py-24 bg-muted/20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-sm font-medium mb-6">
            <Globe className="size-4" />
            Translate
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Hola. Hallo. こんにちは. नमस्ते.</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Make the world your audience. Translate your voiceover, captions, and documentation in one click.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Language Flags */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { lang: "English", flag: "🇺🇸" },
                { lang: "Spanish", flag: "🇪🇸" },
                { lang: "German", flag: "🇩🇪" },
                { lang: "Japanese", flag: "🇯🇵" },
                { lang: "Hindi", flag: "🇮🇳" },
                { lang: "Arabic", flag: "🇸🇦" },
              ].map((item) => (
                <Card
                  key={item.lang}
                  className="border-2 hover:border-violet-200 dark:hover:border-violet-900 transition-colors"
                >
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-4xl mb-2">{item.flag}</div>
                    <p className="text-sm font-medium">{item.lang}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Documentation Preview */}
            <Card className="border-2 border-violet-200 dark:border-violet-900 bg-background">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">How to Book an Airbnb</h4>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      Translate
                    </Button>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <span className="font-bold text-violet-600">1</span>
                      <p>From the website home, search for your desired destination and dates.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-violet-600">2</span>
                      <p>Find a place you like from the list of options.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-violet-600">3</span>
                      <p>Once you've found a place you like, click on it to view more details and read reviews.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">+31 More Languages</p>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">You're in good company</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From start-ups to enterprises, teams of all sizes trust Clueso.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {[
            {
              company: "Global Partners LP",
              logo: "GP",
              quote:
                "Clueso has been a game-changer for supporting our front-line and office workers. Its intuitive interface and powerful AI let us quickly deliver clear, targeted content.",
              name: "Daniel Wood",
              title: "Director of Learning and Development",
            },
            {
              company: "Duda",
              logo: "Duda",
              quote:
                "With Clueso, we created and launched 8 training courses for Duda's new editor in just one quarter—something we never thought was possible given the resources we had.",
              name: "Cyrus Dorosti",
              title: "VP of Customer Success",
            },
            {
              company: "Personio",
              logo: "Personio",
              quote:
                "Clueso has helped us transform our video production, letting our expert video producers focus their time and opening up high-quality video production across our team.",
              name: "Adam Avramescu",
              title: "VP - Scaled Customer Experience",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="border-2 bg-gradient-to-br from-background to-muted/30">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="size-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {testimonial.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-1.5 bg-violet-100 dark:bg-violet-950/30 rounded-lg text-sm font-semibold text-violet-600">
                        {testimonial.logo}
                      </div>
                    </div>
                    <blockquote className="text-lg mb-4 leading-relaxed">{testimonial.quote}</blockquote>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="container py-16 md:py-24 bg-muted/20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Stunning content in just four steps</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -top-4 -left-4 flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xl">
              01
            </div>
            <Card className="border-2 h-full">
              <CardContent className="pt-12 pb-8">
                <div className="flex items-center justify-center size-16 rounded-xl bg-violet-100 dark:bg-violet-950/30 mb-6 mx-auto">
                  <Upload className="size-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Record or Upload</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Record a new video with Clueso or upload an existing screen recording or slide deck.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xl">
              02
            </div>
            <Card className="border-2 h-full">
              <CardContent className="pt-12 pb-8">
                <div className="flex items-center justify-center size-16 rounded-xl bg-violet-100 dark:bg-violet-950/30 mb-6 mx-auto">
                  <Sparkles className="size-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Clueso does the magic</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Clueso's AI improves your script, adds a natural-sounding AI voiceover, and enhances visuals.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xl">
              03
            </div>
            <Card className="border-2 h-full">
              <CardContent className="pt-12 pb-8">
                <div className="flex items-center justify-center size-16 rounded-xl bg-violet-100 dark:bg-violet-950/30 mb-6 mx-auto">
                  <Wand2 className="size-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Customize to Your Liking</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Every video made by Clueso AI is fully customizable. Edit the voice, flow, or visuals directly.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xl">
              04
            </div>
            <Card className="border-2 h-full">
              <CardContent className="pt-12 pb-8">
                <div className="flex items-center justify-center size-16 rounded-xl bg-violet-100 dark:bg-violet-950/30 mb-6 mx-auto">
                  <Share2 className="size-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Export & Share</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Download, embed, or share your creation as a link instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Start for free, upgrade as you grow</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-8 pb-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for trying out Clueso</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>5 videos per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>720p export quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>Basic AI features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>Watermark on videos</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full h-12 bg-transparent" asChild>
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-violet-200 dark:border-violet-900 relative bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-full">
              Popular
            </div>
            <CardContent className="pt-8 pb-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground">For professional content creators</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>Unlimited videos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>4K export quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>No watermark</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-violet-600 mt-0.5 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                asChild
              >
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-16 md:py-24">
        <Card className="border-2 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200 dark:border-violet-900">
          <CardContent className="pt-16 pb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Experience it yourself</h2>
            <Button
              size="lg"
              className="h-14 px-10 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/auth/sign-up">Make Your First Video</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Chrome Extension
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Video className="size-4 text-white" />
              </div>
              <span>© 2025 Clueso. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
