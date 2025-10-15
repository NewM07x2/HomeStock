import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import QuickLinks from '@/components/home/QuickLinks'
import RecentItems from '@/components/home/RecentItems'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <HomeHero />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentItems />
        </div>
        <aside className="md:col-span-1">
          <QuickLinks />
        </aside>
      </div>
    </div>
  )
}