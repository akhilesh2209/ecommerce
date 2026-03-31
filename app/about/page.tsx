'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Award, Users, Globe, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-20 space-y-8 text-center py-12">
          <h1 className="text-5xl font-bold text-foreground sm:text-6xl">
            About PrimeStore
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
            We{"'"}re building the future of e-commerce with cutting-edge technology,
            exceptional products, and world-class customer service.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-12 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To provide customers with the best shopping experience by offering high-quality
              products, competitive prices, and exceptional service. We are committed to
              innovation and continuous improvement to meet the evolving needs of our customers.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To become the world{"'"}s most trusted e-commerce platform where customers can
              find everything they need, with the confidence that they{"'"}re getting premium
              quality and exceptional value every time.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20 space-y-8">
          <h2 className="text-4xl font-bold text-foreground text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: 'Quality First',
                description: 'We curate only the finest products for our customers',
              },
              {
                icon: Users,
                title: 'Customer Focused',
                description: 'Your satisfaction is our top priority',
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Constantly improving our platform and services',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Serving customers worldwide with pride',
              },
            ].map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-border/50 bg-card p-8 space-y-4 text-center hover:shadow-elevation transition-all"
                >
                  <Icon className="h-10 w-10 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-20 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-accent">2M+</p>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-accent">50K+</p>
              <p className="text-muted-foreground">Products</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-accent">150+</p>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-accent">12+</p>
              <p className="text-muted-foreground">Years</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-12">
          <h2 className="text-4xl font-bold text-foreground text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Alice Johnson',
                role: 'Founder & CEO',
                avatar: '👩‍💼',
              },
              {
                name: 'Bob Smith',
                role: 'CTO',
                avatar: '👨‍💼',
              },
              {
                name: 'Carol White',
                role: 'Head of Operations',
                avatar: '👩‍🏫',
              },
              {
                name: 'David Brown',
                role: 'Director of Sales',
                avatar: '👨‍🎓',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-elevation transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl">
                  {member.avatar}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
