'use client'

import { X } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'
import AutocompleteTag, { TagItem } from './AutocompleteTag'

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
const categoryOptions = [
  { value: 'sensoriel', label: { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' }, emoji: '🖐️' },
  { value: 'motricite-fine', label: { fr: 'Motricité fine', en: 'Fine motor', es: 'Motricidad fina' }, emoji: '✂️' },
  { value: 'motricite-globale', label: { fr: 'Motricité globale', en: 'Gross motor', es: 'Motricidad gruesa' }, emoji: '🏃' },
  { value: 'art-plastique', label: { fr: 'Art plastique', en: 'Visual arts', es: 'Artes plásticas' }, emoji: '🎨' },
  { value: 'nature-plein-air', label: { fr: 'Nature & plein air', en: 'Nature & outdoor', es: 'Naturaleza' }, emoji: '🌿' },
  { value: 'diy-recup', label: { fr: 'DIY & récup', en: 'DIY & recycling', es: 'DIY & reciclaje' }, emoji: '♻️' },
  { value: 'cuisine', label: { fr: 'Cuisine', en: 'Cooking', es: 'Cocina' }, emoji: '👩‍🍳' },
  { value: 'jeux-symboliques', label: { fr: 'Jeux symboliques', en: 'Imaginative play', es: 'Juego simbólico' }, emoji: '🎭' },
  { value: 'rituels-routines', label: { fr: 'Rituels & routines', en: 'Routines', es: 'Rutinas' }, emoji: '📋' },
  { value: 'imprimables', label: { fr: 'Imprimables', en: 'Printables', es: 'Imprimibles' }, emoji: '🖨️' }
]

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
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E]">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 mt-1">{t.subtitle}</p>
      </div>

      {/* Categories (Type d'activité) - Liste fermée */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.categories}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 mb-3">{t.categoriesHelp}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categoryOptions.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                formData.categories.includes(cat.value)
                  ? 'bg-[#A8B5A0] text-white'
                  : 'bg-[#F5E6D3] text-[#5D5A4E] hover:bg-[#A8B5A0]/20'
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="truncate">{cat.label[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Themes avec autocomplete */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.themes}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 mb-3">{t.themesHelp}</p>
        <AutocompleteTag
          lang={lang}
          predefinedOptions={predefinedThemes}
          selectedValues={formData.themes}
          onAdd={handleAddTheme}
          onRemove={handleRemoveTheme}
          placeholder={t.themesPlaceholder}
          allowCustom={true}
          colorClass="bg-[#C8D8E4]/50"
        />
      </div>

      {/* Competences avec autocomplete */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.competences}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 mb-3">{t.competencesHelp}</p>
        <AutocompleteTag
          lang={lang}
          predefinedOptions={predefinedCompetences}
          selectedValues={formData.competences}
          onAdd={handleAddCompetence}
          onRemove={handleRemoveCompetence}
          placeholder={t.competencesPlaceholder}
          allowCustom={true}
          colorClass="bg-[#D4A59A]/20"
        />
      </div>

      {/* Keywords (libres) */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.keywords}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 mb-3">{t.keywordsHelp}</p>

        <input
          type="text"
          onKeyDown={addKeyword}
          placeholder={t.keywordsPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all mb-3"
        />

        {formData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map(keyword => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#5D5A4E]/10 text-[#5D5A4E] rounded-full text-sm"
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
