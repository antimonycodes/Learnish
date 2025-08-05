"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Play,
  BookOpen,
  Brain,
  Zap,
  Target,
  Users,
  Star,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Shield,
  ChevronDown,
  Globe,
  Code,
  Palette,
  Music,
  Calculator,
  Languages,
  Camera,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(testimonialInterval);
    };
  }, []);

  const { isSignedIn } = useUser();

  const features = [
    {
      icon: Brain,
      title: "AI Course Architect",
      description:
        "Our AI doesn't just generate content—it understands learning psychology, creates logical progressions, and adapts to different learning styles.",
      stats: "99.2% accuracy rate",
    },
    {
      icon: Target,
      title: "Adaptive Learning Engine",
      description:
        "The system learns from your progress, adjusting difficulty and pacing in real-time to keep you in the optimal learning zone.",
      stats: "3x faster mastery",
    },
    {
      icon: Play,
      title: "Curated Video Library",
      description:
        "Access hand-picked video content from industry experts, automatically synchronized with your learning path and current skill level.",
      stats: "50K+ premium videos",
    },
    {
      icon: BookOpen,
      title: "Interactive Study Maps",
      description:
        "Visualize your learning journey with interactive roadmaps that show dependencies, milestones, and alternative paths to mastery.",
      stats: "Visual learning boost",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "ML Engineer at Google",
      content:
        "I've used every learning platform out there. This AI actually understands how concepts build on each other. My team now uses it for onboarding.",
      rating: 5,
      courses: "Completed: Advanced Machine Learning, System Design",
    },
    {
      name: "Marcus Rodriguez",
      role: "Frontend Developer",
      content:
        "Went from zero to landing my first dev job in 4 months. The personalized roadmap was like having a senior developer mentor me 24/7.",
      rating: 5,
      courses: "Completed: React Mastery, JavaScript Fundamentals",
    },
    {
      name: "Emily Watson",
      role: "Product Designer",
      content:
        "The course structure is incredible. It identified gaps in my knowledge I didn't even know existed and filled them systematically.",
      rating: 5,
      courses: "Completed: UX Research, Design Systems",
    },
    {
      name: "James Park",
      role: "Startup Founder",
      content:
        "This platform taught me digital marketing faster than my MBA program. The AI knew exactly what I needed to learn for my specific business model.",
      rating: 5,
      courses: "Completed: Growth Marketing, Analytics",
    },
  ];

  const courseCategories = [
    {
      icon: Code,
      name: "Programming",
      count: "2,450",
      color: "text-orange-500",
    },
    { icon: Palette, name: "Design", count: "1,230", color: "text-orange-500" },
    {
      icon: TrendingUp,
      name: "Business",
      count: "1,890",
      color: "text-orange-500",
    },
    {
      icon: Music,
      name: "Creative Arts",
      count: "980",
      color: "text-orange-500",
    },
    {
      icon: Calculator,
      name: "Mathematics",
      count: "1,120",
      color: "text-orange-500",
    },
    {
      icon: Languages,
      name: "Languages",
      count: "890",
      color: "text-orange-500",
    },
    {
      icon: Camera,
      name: "Photography",
      count: "670",
      color: "text-orange-500",
    },
    {
      icon: Globe,
      name: "Marketing",
      count: "1,340",
      color: "text-orange-500",
    },
  ];

  const stats = [
    {
      number: "127K+",
      label: "Active Learners",
      description: "Growing by 2K+ monthly",
    },
    {
      number: "89K+",
      label: "Courses Generated",
      description: "Across 200+ topics",
    },
    {
      number: "94%",
      label: "Completion Rate",
      description: "Industry average: 15%",
    },
    {
      number: "4.9",
      label: "Student Rating",
      description: "From 12K+ reviews",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cursor Follower */}
      <div
        className="fixed w-6 h-6 border border-orange-500/30 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: hoveredFeature !== null ? "scale(3)" : "scale(1)",
        }}
      />

      {/* Header */}
      <header className="fixed w-full top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <div className="relative flex items-center space-x-3">
            <Image src="/logo.svg" width={40} height={40} alt="logo" />
            <span className="text-2xl font-bold relative">
              Learn
              <span className="relative inline-block">ish</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              Reviews
            </a>
            <UserButton />
          </nav>
        </div>
      </header>

      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute w-24 h-24 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-bounce" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.05),transparent_50%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* <div
              className="inline-block mb-8"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                Powered by Advanced AI
              </span>
            </div> */}

            <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-tight tracking-tight">
              Learn
              <span className="text-orange-500"> Anything</span>
              <br />
              <span className="text-white/60">Systematically</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop jumping between random tutorials. Our AI creates structured
              learning paths that actually make sense—with the right content, in
              the right order, at the right pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!isSignedIn ? (
                <>
                  <Link href="/sign-in">
                    <button className="bg-orange-500 text-black font-semibold px-8 py-3 text-lg rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20">
                      Free Trial
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button className="bg-white text-orange-500 px-8 py-3 text-lg rounded-md transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/workspace">
                  <button className="bg-orange-500 text-black font-semibold px-8 py-3 text-lg rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20">
                    Explore
                  </button>
                </Link>
              )}
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:text-orange-500 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/60 text-sm mb-1">{stat.label}</div>
                  <div className="text-white/40 text-xs">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Master Any Subject</h2>
            <p className="text-white/60 text-lg">
              From coding to creativity, our AI adapts to every learning domain
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {courseCategories.map((category, index) => (
              <div
                key={index}
                className="group p-6 bg-black border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <category.icon
                  className={`w-8 h-8 ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-white/40 text-sm">
                  {category.count} courses
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Why Our AI Is <span className="text-orange-500">Different</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Most AI just generates content. Ours understands how humans
              actually learn and creates courses that work with your brain, not
              against it.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-orange-500/20 transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center text-orange-500 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {feature.stats}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              From Idea to <span className="text-orange-500">Mastery</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Our AI doesn't just create courses—it creates learning experiences
              that stick.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-white/10"></div>

            {[
              {
                step: "01",
                title: "AI Analyzes Your Goal",
                description:
                  "Tell us what you want to learn. Our AI breaks it down into core concepts, identifies prerequisites, and maps out the optimal learning sequence.",
                detail:
                  "Uses advanced NLP to understand context and complexity",
              },
              {
                step: "02",
                title: "Personalized Course Architecture",
                description:
                  "We don't just generate content—we architect your learning journey based on cognitive science, your schedule, and proven educational frameworks.",
                detail:
                  "Incorporates spaced repetition and active recall principles",
              },
              {
                step: "03",
                title: "Dynamic Content Curation",
                description:
                  "Our AI selects the best videos, articles, and exercises from thousands of sources, creating a coherent narrative that builds understanding step by step.",
                detail:
                  "Quality-scored content from verified educational sources",
              },
              {
                step: "04",
                title: "Adaptive Progress Tracking",
                description:
                  "As you learn, the AI adjusts difficulty, suggests review sessions, and identifies knowledge gaps before they become problems.",
                detail: "Real-time adaptation based on your learning patterns",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-20 ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`w-full max-w-md ${
                    index % 2 === 0 ? "mr-8" : "ml-8"
                  }`}
                >
                  <div className="group bg-black border border-white/10 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-500 hover:scale-105">
                    <div className="text-orange-500/40 text-6xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-500 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-orange-500/70 text-sm font-medium">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-black"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Simple, <span className="text-orange-500">Honest</span> Pricing
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees, no
              complicated tiers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <div className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:scale-105 transition-all duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                <div className="text-5xl font-bold mb-2">$0</div>
                <p className="text-white/60">Perfect for exploring</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "3 complete AI courses",
                  "Basic progress tracking",
                  "Community access",
                  "Standard video quality",
                  "Email support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    <Check className="w-5 h-5 text-orange-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-white text-black hover:bg-white/90 py-4 text-lg rounded-full font-semibold transition-all duration-300">
                Start Free Trial
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="group p-8 bg-orange-500/5 border-2 border-orange-500/20 rounded-3xl hover:scale-105 transition-all duration-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-5xl font-bold mb-2">
                  $19
                  <span className="text-lg text-white/60 font-normal">
                    /month
                  </span>
                </div>
                <p className="text-white/70">For serious learners</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited AI-generated courses",
                  "Advanced analytics & insights",
                  "Priority support (24/7)",
                  "HD video content",
                  "Downloadable resources",
                  "Custom learning paths",
                  "Achievement certificates",
                  "Ad-free experience",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <Check className="w-5 h-5 text-orange-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black py-4 text-lg rounded-full font-semibold transition-all duration-300">
                Upgrade to Premium
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-white/60">
                  <Shield className="w-4 h-4 inline mr-1" />
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Real Results from{" "}
              <span className="text-orange-500">Real People</span>
            </h2>
            <p className="text-xl text-white/60">
              These aren't cherry-picked reviews. These are career-changing
              transformations.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-black border border-white/10 rounded-3xl p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-orange-500 fill-current"
                    />
                  )
                )}
              </div>

              <blockquote className="text-2xl text-white/90 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="mb-4">
                <div className="font-bold text-xl">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-orange-500">
                  {testimonials[currentTestimonial].role}
                </div>
                <div className="text-white/40 text-sm mt-2">
                  {testimonials[currentTestimonial].courses}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-orange-500"
                      : "bg-white/20"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl font-bold mb-8">
            Stop Wasting Time on
            <br />
            <span className="text-orange-500">Random Tutorials</span>
          </h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            Join over 127,000 learners who've discovered the power of
            structured, AI-driven education. Your future self will thank you.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black px-12 py-6 text-xl rounded-full font-semibold transition-all duration-300 hover:scale-105">
              Start Your Journey
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-white/60">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-orange-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              Setup in under 2 minutes
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-orange-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-500 rounded transform rotate-45"></div>
            </div>
            <span className="text-2xl font-bold">CourseAI</span>
          </div>
          <p className="text-white/40">
            © 2025 CourseAI. Making learning systematic, one course at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
