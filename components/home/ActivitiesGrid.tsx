import ActivityCard from '@/components/cards/ActivityCard'
import BookCard from '@/components/cards/BookCard'
import GameCard from '@/components/cards/GameCard'
import type { Ressource, Language } from '@/lib/types'

interface ActivitiesGridProps {
  activities: Ressource[]
  lang: Language
}

export default function ActivitiesGrid({ activities, lang }: ActivitiesGridProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground-secondary text-body">
          {lang === 'fr' ? 'Aucun contenu disponible pour le moment.' : 'No content available at the moment.'}
        </p>
      </div>
    )
  }

  const renderCard = (item: Ressource) => {
    switch (item.type) {
      case 'livre':
        return <BookCard key={item.id} book={item} lang={lang} />
      case 'jeu':
        return <GameCard key={item.id} game={item} lang={lang} />
      default:
        return <ActivityCard key={item.id} activity={item} lang={lang} />
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((item) => renderCard(item))}
    </div>
  )
}
