'use client'

import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFiltersProps {
  isOpen?: boolean
  onClose?: () => void
}

const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $250', min: 100, max: 250 },
  { label: '$250 - $500', min: 250, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
]

const RATINGS = [
  { label: '5 Star', value: 5 },
  { label: '4 Star & up', value: 4 },
  { label: '3 Star & up', value: 3 },
  { label: '2 Star & up', value: 2 },
]

const BRANDS = [
  'TechPro',
  'StyleMax',
  'HomeElite',
  'SportZone',
  'PremiumCo',
  'LuxuryBrand',
]

export function ProductFilters({ isOpen, onClose }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'rating'])
  )

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Filters Panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-border/50 bg-card shadow-elevation transition-transform lg:relative lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 p-6">
          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 lg:hidden"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mt-8 lg:mt-0">
            <h3 className="font-bold text-foreground">Filters</h3>
          </div>

          {/* Price Filter */}
          <FilterSection
            title="Price"
            isExpanded={expandedSections.has('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-input accent-accent"
                  />
                  <span className="text-sm text-foreground/80">{range.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection
            title="Rating"
            isExpanded={expandedSections.has('rating')}
            onToggle={() => toggleSection('rating')}
          >
            <div className="space-y-3">
              {RATINGS.map((rating) => (
                <label
                  key={rating.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-input accent-accent"
                  />
                  <span className="text-sm text-foreground/80">{rating.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brand Filter */}
          <FilterSection
            title="Brand"
            isExpanded={expandedSections.has('brand')}
            onToggle={() => toggleSection('brand')}
          >
            <div className="space-y-3">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-input accent-accent"
                  />
                  <span className="text-sm text-foreground/80">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Stock Filter */}
          <FilterSection
            title="Availability"
            isExpanded={expandedSections.has('stock')}
            onToggle={() => toggleSection('stock')}
          >
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border bg-input accent-accent"
                />
                <span className="text-sm text-foreground/80">In Stock</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-input accent-accent"
                />
                <span className="text-sm text-foreground/80">Out of Stock</span>
              </label>
            </div>
          </FilterSection>

          {/* Clear Filters Button */}
          <button className="w-full rounded-lg border border-border/50 bg-muted text-foreground py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  )
}

function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3 border-b border-border/50 pb-6 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full hover:text-accent transition-colors"
      >
        <h4 className="font-semibold text-foreground">{title}</h4>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && <div>{children}</div>}
    </div>
  )
}
