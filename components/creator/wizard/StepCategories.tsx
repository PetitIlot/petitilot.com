'use client'

import React from 'react'
import { X, Check } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'
import AutocompleteTag, { TagItem } from './AutocompleteTag'
import { GEMS, type GemColor } from '@/components/ui/button'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const translations = {
  fr: {
    title: 'Catégorisation',
    subtitle: 'Aidez les parents à trouver votre ressource',
    categories: 'Type d\'activité *',
    categoriesHelp: 'Sélectionnez 1 à 3 types',
    themes: 'Thèmes',
    themesHelp: 'Recherchez ou ajoutez les thèmes abordés',
    themesPlaceholder: 'Rechercher un thème...',
    competences: 'Compétences développées',
    competencesHelp: 'Recherchez ou ajoutez les compétences travaillées',
    competencesPlaceholder: 'Rechercher une compétence...',
    keywords: 'Mots-clés',
    keywordsPlaceholder: 'Appuyez Entrée pour ajouter',
    keywordsHelp: 'Ajoutez des mots-clés libres pour améliorer la recherche (max 10)'
  },
  en: {
    title: 'Categorization',
    subtitle: 'Help parents find your resource',
    categories: 'Activity type *',
    categoriesHelp: 'Select 1 to 3 types',
    themes: 'Themes',
    themesHelp: 'Search or add the themes covered',
    themesPlaceholder: 'Search for a theme...',
    competences: 'Skills developed',
    competencesHelp: 'Search or add the skills worked on',
    competencesPlaceholder: 'Search for a skill...',
    keywords: 'Keywords',
    keywordsPlaceholder: 'Press Enter to add',
    keywordsHelp: 'Add free keywords to improve search (max 10)'
  },
  es: {
    title: 'Categorización',
    subtitle: 'Ayuda a los padres a encontrar tu recurso',
    categories: 'Tipo de actividad *',
    categoriesHelp: 'Selecciona de 1 a 3 tipos',
    themes: 'Temas',
    themesHelp: 'Busca o agrega los temas abordados',
    themesPlaceholder: 'Buscar un tema...',
    competences: 'Competencias desarrolladas',
    competencesHelp: 'Busca o agrega las competencias trabajadas',
    competencesPlaceholder: 'Buscar una competencia...',
    keywords: 'Palabras clave',
    keywordsPlaceholder: 'Presiona Enter para agregar',
    keywordsHelp: 'Agrega palabras clave libres para mejorar la búsqueda (máx 10)'
  }
}

// Types d'activité (catégories principales) - liste fermée
// Chaque catégorie a sa couleur gemme distincte
const categoryOptions: { value: string; label: Record<string, string>; emoji: string; gem: GemColor }[] = [
  { value: 'sensoriel', label: { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' }, emoji: '🖐️', gem: 'rose' },
  { value: 'motricite-fine', label: { fr: 'Motricité fine', en: 'Fine motor', es: 'Motricidad fina' }, emoji: '✂️', gem: 'mauve' },
  { value: 'motricite-globale', label: { fr: 'Motricité globale', en: 'Gross motor', es: 'Motricidad gruesa' }, emoji: '🏃', gem: 'sky' },
  { value: 'art-plastique', label: { fr: 'Art plastique', en: 'Visual arts', es: 'Artes plásticas' }, emoji: '🎨', gem: 'terracotta' },
  { value: 'nature-plein-air', label: { fr: 'Nature & plein air', en: 'Nature & outdoor', es: 'Naturaleza' }, emoji: '🌿', gem: 'sage' },
  { value: 'diy-recup', label: { fr: 'DIY & récup', en: 'DIY & recycling', es: 'DIY & reciclaje' }, emoji: '♻️', gem: 'amber' },
  { value: 'cuisine', label: { fr: 'Cuisine', en: 'Cooking', es: 'Cocina' }, emoji: '👩‍🍳', gem: 'terracotta' },
  { value: 'jeux-symboliques', label: { fr: 'Jeux symboliques', en: 'Imaginative play', es: 'Juego simbólico' }, emoji: '🎭', gem: 'mauve' },
  { value: 'rituels-routines', label: { fr: 'Rituels & routines', en: 'Routines', es: 'Rutinas' }, emoji: '📋', gem: 'neutral' },
  { value: 'imprimables', label: { fr: 'Imprimables', en: 'Printables', es: 'Imprimibles' }, emoji: '🖨️', gem: 'sky' }
]

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

// Thèmes prédéfinis (avec possibilité d'ajout custom)
const predefinedThemes: TagItem[] = [
  // Saisons
  { value: 'Printemps', label: { fr: 'Printemps', en: 'Spring', es: 'Primavera' }, emoji: '🌸' },
  { value: 'Été', label: { fr: 'Été', en: 'Summer', es: 'Verano' }, emoji: '☀️' },
  { value: 'Automne', label: { fr: 'Automne', en: 'Fall', es: 'Otoño' }, emoji: '🍂' },
  { value: 'Hiver', label: { fr: 'Hiver', en: 'Winter', es: 'Invierno' }, emoji: '❄️' },
  // Fêtes
  { value: 'Noël', label: { fr: 'Noël', en: 'Christmas', es: 'Navidad' }, emoji: '🎄' },
  { value: 'Pâques', label: { fr: 'Pâques', en: 'Easter', es: 'Pascua' }, emoji: '🐰' },
  { value: 'Halloween', label: { fr: 'Halloween', en: 'Halloween', es: 'Halloween' }, emoji: '🎃' },
  { value: 'Saint-Valentin', label: { fr: 'Saint-Valentin', en: 'Valentine\'s Day', es: 'San Valentín' }, emoji: '💕' },
  { value: 'Fête des mères', label: { fr: 'Fête des mères', en: 'Mother\'s Day', es: 'Día de la madre' }, emoji: '💐' },
  { value: 'Fête des pères', label: { fr: 'Fête des pères', en: 'Father\'s Day', es: 'Día del padre' }, emoji: '👔' },
  { value: 'Carnaval', label: { fr: 'Carnaval', en: 'Carnival', es: 'Carnaval' }, emoji: '🎭' },
  // Nature & environnement
  { value: 'Nature', label: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' }, emoji: '🌳' },
  { value: 'Animaux', label: { fr: 'Animaux', en: 'Animals', es: 'Animales' }, emoji: '🐾' },
  { value: 'Océan & mer', label: { fr: 'Océan & mer', en: 'Ocean & sea', es: 'Océano y mar' }, emoji: '🌊' },
  { value: 'Jardin & plantes', label: { fr: 'Jardin & plantes', en: 'Garden & plants', es: 'Jardín y plantas' }, emoji: '🌱' },
  { value: 'Forêt', label: { fr: 'Forêt', en: 'Forest', es: 'Bosque' }, emoji: '🌲' },
  { value: 'Météo', label: { fr: 'Météo', en: 'Weather', es: 'Clima' }, emoji: '🌈' },
  { value: 'Espace', label: { fr: 'Espace', en: 'Space', es: 'Espacio' }, emoji: '🚀' },
  // Vie quotidienne
  { value: 'Maison', label: { fr: 'Maison', en: 'Home', es: 'Casa' }, emoji: '🏠' },
  { value: 'Famille', label: { fr: 'Famille', en: 'Family', es: 'Familia' }, emoji: '👨‍👩‍👧' },
  { value: 'École', label: { fr: 'École', en: 'School', es: 'Escuela' }, emoji: '🏫' },
  { value: 'Transports', label: { fr: 'Transports', en: 'Transportation', es: 'Transporte' }, emoji: '🚗' },
  { value: 'Alimentation', label: { fr: 'Alimentation', en: 'Food', es: 'Alimentación' }, emoji: '🍎' },
  { value: 'Corps humain', label: { fr: 'Corps humain', en: 'Human body', es: 'Cuerpo humano' }, emoji: '🫀' },
  // Imaginaire
  { value: 'Contes & Histoires', label: { fr: 'Contes & Histoires', en: 'Stories', es: 'Cuentos' }, emoji: '📚' },
  { value: 'Dinosaures', label: { fr: 'Dinosaures', en: 'Dinosaurs', es: 'Dinosaurios' }, emoji: '🦕' },
  { value: 'Pirates', label: { fr: 'Pirates', en: 'Pirates', es: 'Piratas' }, emoji: '🏴‍☠️' },
  { value: 'Princesses', label: { fr: 'Princesses', en: 'Princesses', es: 'Princesas' }, emoji: '👸' },
  { value: 'Super-héros', label: { fr: 'Super-héros', en: 'Superheroes', es: 'Superhéroes' }, emoji: '🦸' },
  // Autres
  { value: 'Musique', label: { fr: 'Musique', en: 'Music', es: 'Música' }, emoji: '🎵' },
  { value: 'Couleurs', label: { fr: 'Couleurs', en: 'Colors', es: 'Colores' }, emoji: '🎨' },
  { value: 'Formes', label: { fr: 'Formes', en: 'Shapes', es: 'Formas' }, emoji: '🔷' },
  { value: 'Chiffres', label: { fr: 'Chiffres', en: 'Numbers', es: 'Números' }, emoji: '🔢' },
  { value: 'Lettres', label: { fr: 'Lettres', en: 'Letters', es: 'Letras' }, emoji: '🔤' },
]

// Compétences prédéfinies (avec possibilité d'ajout custom)
const predefinedCompetences: TagItem[] = [
  // Motricité
  { value: 'Motricité fine', label: { fr: 'Motricité fine', en: 'Fine motor skills', es: 'Motricidad fina' }, emoji: '✋' },
  { value: 'Motricité globale', label: { fr: 'Motricité globale', en: 'Gross motor skills', es: 'Motricidad gruesa' }, emoji: '🤸' },
  { value: 'Coordination', label: { fr: 'Coordination', en: 'Coordination', es: 'Coordinación' }, emoji: '🎯' },
  { value: 'Équilibre', label: { fr: 'Équilibre', en: 'Balance', es: 'Equilibrio' }, emoji: '⚖️' },
  // Cognitif
  { value: 'Logique & Maths', label: { fr: 'Logique & Maths', en: 'Logic & Math', es: 'Lógica y Matemáticas' }, emoji: '🔢' },
  { value: 'Mémoire', label: { fr: 'Mémoire', en: 'Memory', es: 'Memoria' }, emoji: '🧠' },
  { value: 'Concentration', label: { fr: 'Concentration', en: 'Focus', es: 'Concentración' }, emoji: '🎯' },
  { value: 'Résolution de problèmes', label: { fr: 'Résolution de problèmes', en: 'Problem solving', es: 'Resolución de problemas' }, emoji: '💡' },
  { value: 'Observation', label: { fr: 'Observation', en: 'Observation', es: 'Observación' }, emoji: '👁️' },
  { value: 'Tri & classement', label: { fr: 'Tri & classement', en: 'Sorting & classifying', es: 'Clasificación' }, emoji: '📊' },
  // Langage
  { value: 'Langage', label: { fr: 'Langage', en: 'Language', es: 'Lenguaje' }, emoji: '💬' },
  { value: 'Vocabulaire', label: { fr: 'Vocabulaire', en: 'Vocabulary', es: 'Vocabulario' }, emoji: '📖' },
  { value: 'Pré-lecture', label: { fr: 'Pré-lecture', en: 'Pre-reading', es: 'Pre-lectura' }, emoji: '📚' },
  { value: 'Pré-écriture', label: { fr: 'Pré-écriture', en: 'Pre-writing', es: 'Pre-escritura' }, emoji: '✏️' },
  // Créativité & expression
  { value: 'Créativité', label: { fr: 'Créativité', en: 'Creativity', es: 'Creatividad' }, emoji: '💡' },
  { value: 'Imagination', label: { fr: 'Imagination', en: 'Imagination', es: 'Imaginación' }, emoji: '🌈' },
  { value: 'Expression artistique', label: { fr: 'Expression artistique', en: 'Artistic expression', es: 'Expresión artística' }, emoji: '🎨' },
  // Émotionnel & social
  { value: 'Gestion des émotions', label: { fr: 'Gestion des émotions', en: 'Emotional regulation', es: 'Gestión emocional' }, emoji: '💚' },
  { value: 'Socialisation', label: { fr: 'Socialisation', en: 'Social skills', es: 'Socialización' }, emoji: '👥' },
  { value: 'Coopération', label: { fr: 'Coopération', en: 'Cooperation', es: 'Cooperación' }, emoji: '🤝' },
  { value: 'Patience', label: { fr: 'Patience', en: 'Patience', es: 'Paciencia' }, emoji: '⏳' },
  { value: 'Confiance en soi', label: { fr: 'Confiance en soi', en: 'Self-confidence', es: 'Confianza en sí mismo' }, emoji: '⭐' },
  // Autonomie
  { value: 'Autonomie', label: { fr: 'Autonomie', en: 'Independence', es: 'Autonomía' }, emoji: '🌟' },
  { value: 'Vie pratique', label: { fr: 'Vie pratique', en: 'Practical life', es: 'Vida práctica' }, emoji: '🧹' },
  // Sensoriel
  { value: 'Découverte sensorielle', label: { fr: 'Découverte sensorielle', en: 'Sensory discovery', es: 'Descubrimiento sensorial' }, emoji: '👀' },
  { value: 'Éveil musical', label: { fr: 'Éveil musical', en: 'Musical awakening', es: 'Despertar musical' }, emoji: '🎶' },
]

interface StepCategoriesProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepCategories({ formData, updateFormData, lang }: StepCategoriesProps) {
  const t = translations[lang]

  // Detect dark mode
  const [isDark, setIsDark] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Categories (liste fermée)
  const toggleCategory = (value: string) => {
    const current = formData.categories
    if (current.includes(value)) {
      updateFormData({ categories: current.filter(c => c !== value) })
    } else if (current.length < 3) {
      updateFormData({ categories: [...current, value] })
    }
  }

  // Themes avec autocomplete
  const handleAddTheme = (value: string, isCustom: boolean) => {
    if (formData.themes.includes(value)) return
    updateFormData({
      themes: [...formData.themes, value],
      customThemes: isCustom
        ? [...formData.customThemes, value]
        : formData.customThemes
    })
  }

  const handleRemoveTheme = (value: string) => {
    updateFormData({
      themes: formData.themes.filter(t => t !== value),
      customThemes: formData.customThemes.filter(t => t !== value)
    })
  }

  // Competences avec autocomplete
  const handleAddCompetence = (value: string, isCustom: boolean) => {
    if (formData.competences.includes(value)) return
    updateFormData({
      competences: [...formData.competences, value],
      customCompetences: isCustom
        ? [...formData.customCompetences, value]
        : formData.customCompetences
    })
  }

  const handleRemoveCompetence = (value: string) => {
    updateFormData({
      competences: formData.competences.filter(c => c !== value),
      customCompetences: formData.customCompetences.filter(c => c !== value)
    })
  }

  // Keywords (libres)
  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = e.currentTarget.value.trim().toLowerCase()
      if (value && !formData.keywords.includes(value) && formData.keywords.length < 10) {
        updateFormData({ keywords: [...formData.keywords, value] })
        e.currentTarget.value = ''
      }
    }
  }

  const removeKeyword = (keyword: string) => {
    updateFormData({ keywords: formData.keywords.filter(k => k !== keyword) })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E] dark:text-white">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 dark:text-white/50 mt-1">{t.subtitle}</p>
      </div>

      {/* Categories (Type d'activité) - Gemstone Buttons */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-[#C8CED6] mb-2">
          {t.categories}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-[#C8CED6]/50 mb-3">{t.categoriesHelp}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryOptions.map(cat => {
            const selected = formData.categories.includes(cat.value)
            const g = GEMS[cat.gem]
            const rgb = hexToRgb(isDark ? g.dark : g.light)
            const glowRGB = isDark ? g.glowDark : g.glow
            const atMax = formData.categories.length >= 3 && !selected

            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                disabled={atMax}
                className="group relative overflow-hidden transition-all duration-300 active:scale-[0.97]"
                style={{
                  borderRadius: 14,
                  padding: 1.5,
                  background: selected
                    ? `linear-gradient(135deg, rgba(${glowRGB},0.7) 0%, rgba(${glowRGB},0.4) 50%, rgba(${glowRGB},0.6) 100%)`
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)',
                  boxShadow: selected
                    ? `0 0 16px rgba(${glowRGB},${isDark ? 0.5 : 0.35}), 0 2px 8px rgba(0,0,0,${isDark ? 0.25 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.15 : 0.5})`
                    : `0 2px 8px rgba(0,0,0,${isDark ? 0.2 : 0.04}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.45})`,
                  opacity: atMax ? 0.4 : 1,
                  cursor: atMax ? 'not-allowed' : 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 12.5,
                    fontSize: 13,
                    fontWeight: 650,
                    letterSpacing: '-0.01em',
                    color: selected
                      ? (isDark ? g.textDark : g.text)
                      : (isDark ? '#C8CED6' : '#5D5A4E'),
                    background: selected
                      ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.26 : 0.34}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.20 : 0.28}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.24 : 0.32}) 100%)`
                      : isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)',
                    backdropFilter: selected ? 'blur(12px) saturate(140%)' : 'none',
                    WebkitBackdropFilter: selected ? 'blur(12px) saturate(140%)' : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Frost overlay for selected state */}
                  {selected && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: isDark
                          ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
                          : 'linear-gradient(170deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.40) 45%, rgba(255,255,255,0.44) 100%)',
                        borderRadius: 12.5,
                      }}
                    />
                  )}
                  {/* Glass shine top */}
                  {selected && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '6%',
                        right: '6%',
                        height: '45%',
                        pointerEvents: 'none',
                        background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.10 : 0.28}) 0%, rgba(255,255,255,${isDark ? 0.02 : 0.06}) 50%, transparent 100%)`,
                        borderRadius: '12.5px 12.5px 50% 50%',
                      }}
                    />
                  )}
                  {/* Content */}
                  <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <FilterIcon value={cat.value} size={18} className="flex-shrink-0" />
                    <span className="truncate flex-1 text-left">{cat.label[lang]}</span>
                    {selected && (
                      <Check
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: isDark ? g.textDark : g.text }}
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Themes avec autocomplete */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.themes}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.themesHelp}</p>
        <AutocompleteTag
          lang={lang}
          predefinedOptions={predefinedThemes}
          selectedValues={formData.themes}
          onAdd={handleAddTheme}
          onRemove={handleRemoveTheme}
          placeholder={t.themesPlaceholder}
          allowCustom={true}
          gem="sky"
        />
      </div>

      {/* Competences avec autocomplete */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.competences}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.competencesHelp}</p>
        <AutocompleteTag
          lang={lang}
          predefinedOptions={predefinedCompetences}
          selectedValues={formData.competences}
          onAdd={handleAddCompetence}
          onRemove={handleRemoveCompetence}
          placeholder={t.competencesPlaceholder}
          allowCustom={true}
          gem="rose"
        />
      </div>

      {/* Keywords (libres) */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.keywords}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.keywordsHelp}</p>

        <input
          type="text"
          onKeyDown={addKeyword}
          placeholder={t.keywordsPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 mb-3"
        />

        {formData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map(keyword => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#5D5A4E]/10 dark:bg-white/10 text-[#5D5A4E] dark:text-white/80 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
