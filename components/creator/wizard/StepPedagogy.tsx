'use client'

import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'
import { GEMS } from '@/components/ui/button'
import { hexToRgb } from '@/components/filters/gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const translations = {
  fr: {
    title: 'Informations pédagogiques',
    subtitle: 'Aidez les parents à choisir',
    ageRange: 'Tranche d\'âge',
    ageFrom: 'De',
    ageTo: 'à',
    years: 'ans',
    duration: 'Durée de l\'activité',
    durationPrep: 'Temps de préparation',
    minutes: 'minutes',
    intensity: 'Intensité',
    intensityLeger: 'Léger',
    intensityLegerDesc: 'Activité calme, peu de mouvement',
    intensityMoyen: 'Moyen',
    intensityMoyenDesc: 'Activité modérée, quelques mouvements',
    intensityIntense: 'Intense',
    intensityIntenseDesc: 'Activité physique, beaucoup de mouvement',
    difficulty: 'Niveau de difficulté',
    easy: 'Facile',
    easyDesc: 'Première découverte du thème/compétence',
    medium: 'Moyen',
    mediumDesc: 'Thème/compétence déjà familier',
    hard: 'Difficile',
    hardDesc: 'Thème/compétence préféré, maîtrisé',
    autonomy: 'Autonomie possible',
    autonomyDesc: 'L\'enfant peut réaliser l\'activité seul après démonstration'
  },
  en: {
    title: 'Pedagogical Information',
    subtitle: 'Help parents choose',
    ageRange: 'Age range',
    ageFrom: 'From',
    ageTo: 'to',
    years: 'years',
    duration: 'Activity duration',
    durationPrep: 'Preparation time',
    minutes: 'minutes',
    intensity: 'Intensity',
    intensityLeger: 'Light',
    intensityLegerDesc: 'Calm activity, little movement',
    intensityMoyen: 'Moderate',
    intensityMoyenDesc: 'Moderate activity, some movement',
    intensityIntense: 'Intense',
    intensityIntenseDesc: 'Physical activity, lots of movement',
    difficulty: 'Difficulty level',
    easy: 'Easy',
    easyDesc: 'First discovery of the theme/skill',
    medium: 'Medium',
    mediumDesc: 'Theme/skill already familiar',
    hard: 'Hard',
    hardDesc: 'Favorite theme/skill, mastered',
    autonomy: 'Can be done autonomously',
    autonomyDesc: 'Child can do the activity alone after demonstration'
  },
  es: {
    title: 'Información pedagógica',
    subtitle: 'Ayuda a los padres a elegir',
    ageRange: 'Rango de edad',
    ageFrom: 'De',
    ageTo: 'a',
    years: 'años',
    duration: 'Duración de la actividad',
    durationPrep: 'Tiempo de preparación',
    minutes: 'minutos',
    intensity: 'Intensidad',
    intensityLeger: 'Ligera',
    intensityLegerDesc: 'Actividad tranquila, poco movimiento',
    intensityMoyen: 'Moderada',
    intensityMoyenDesc: 'Actividad moderada, algo de movimiento',
    intensityIntense: 'Intensa',
    intensityIntenseDesc: 'Actividad física, mucho movimiento',
    difficulty: 'Nivel de dificultad',
    easy: 'Fácil',
    easyDesc: 'Primer descubrimiento del tema/habilidad',
    medium: 'Medio',
    mediumDesc: 'Tema/habilidad ya familiar',
    hard: 'Difícil',
    hardDesc: 'Tema/habilidad favorito, dominado',
    autonomy: 'Puede hacerse de forma autónoma',
    autonomyDesc: 'El niño puede hacer la actividad solo después de una demostración'
  }
}

const ageOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' }
]

interface StepPedagogyProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepPedagogy({ formData, updateFormData, lang }: StepPedagogyProps) {
  const t = translations[lang]
  const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null)
  const [hoveredIntensity, setHoveredIntensity] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const intensities = [
    { value: 'leger', label: t.intensityLeger, desc: t.intensityLegerDesc, emoji: '🧘', color: 'bg-green-100 border-green-400 text-green-700' },
    { value: 'moyen', label: t.intensityMoyen, desc: t.intensityMoyenDesc, emoji: '🚶', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
    { value: 'intense', label: t.intensityIntense, desc: t.intensityIntenseDesc, emoji: '🏃', color: 'bg-orange-100 border-orange-400 text-orange-700' }
  ]

  const difficulties = [
    { value: 'beginner', label: t.easy, desc: t.easyDesc, color: 'bg-green-100 border-green-400 text-green-700' },
    { value: 'advanced', label: t.medium, desc: t.mediumDesc, color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
    { value: 'expert', label: t.hard, desc: t.hardDesc, color: 'bg-orange-100 border-orange-400 text-orange-700' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E] dark:text-white">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 dark:text-white/50 mt-1">{t.subtitle}</p>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">
          {t.ageRange}
        </label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.ageFrom}</span>
          <select
            value={formData.age_min ?? ''}
            onChange={(e) => updateFormData({ age_min: e.target.value ? parseInt(e.target.value) : null })}
            className="px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
          >
            <option value="">-</option>
            {ageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label} {t.years}</option>
            ))}
          </select>
          <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.ageTo}</span>
          <select
            value={formData.age_max ?? ''}
            onChange={(e) => updateFormData({ age_max: e.target.value ? parseInt(e.target.value) : null })}
            className="px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
          >
            <option value="">-</option>
            {ageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label} {t.years}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration & Prep Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">
            {t.duration}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="180"
              value={formData.duration ?? ''}
              onChange={(e) => updateFormData({ duration: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="30"
              className="w-24 px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
            />
            <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.minutes}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">
            {t.durationPrep}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="120"
              value={formData.duration_prep ?? ''}
              onChange={(e) => updateFormData({ duration_prep: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="10"
              className="w-24 px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
            />
            <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.minutes}</span>
          </div>
        </div>
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">
          {t.intensity}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {intensities.map(int => (
            <div key={int.value} className="relative">
              <button
                type="button"
                onClick={() => updateFormData({ intensity: int.value as 'leger' | 'moyen' | 'intense' })}
                onMouseEnter={() => setHoveredIntensity(int.value)}
                onMouseLeave={() => setHoveredIntensity(null)}
                className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
                  formData.intensity === int.value
                    ? int.color + ' border-current'
                    : 'bg-white border-[#E5E7EB] hover:border-[#A8B5A0]/50 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'
                }`}
              >
                <span className="mb-1 flex justify-center"><FilterIcon value={int.value} size={24} /></span>
                <span className={`text-sm font-semibold ${formData.intensity === int.value ? '' : 'text-[#5D5A4E] dark:text-white'}`}>
                  {int.label}
                </span>
              </button>
              {/* Tooltip */}
              {hoveredIntensity === int.value && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-[200px] text-center">
                  {int.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">
          {t.difficulty}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map(diff => (
            <div key={diff.value} className="relative">
              <button
                type="button"
                onClick={() => updateFormData({ difficulte: diff.value as 'beginner' | 'advanced' | 'expert' })}
                onMouseEnter={() => setHoveredDifficulty(diff.value)}
                onMouseLeave={() => setHoveredDifficulty(null)}
                className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
                  formData.difficulte === diff.value
                    ? diff.color + ' border-current'
                    : 'bg-white border-[#E5E7EB] hover:border-[#A8B5A0]/50 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'
                }`}
              >
                <span className={`text-sm font-semibold ${formData.difficulte === diff.value ? '' : 'text-[#5D5A4E] dark:text-white'}`}>
                  {diff.label}
                </span>
              </button>
              {/* Tooltip */}
              {hoveredDifficulty === diff.value && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-[200px] text-center">
                  {diff.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Autonomy Toggle — gem sage */}
      {(() => {
        const gem = GEMS.sage
        const rgb = hexToRgb(isDark ? gem.dark : gem.light)
        const glowRGB = isDark ? gem.glowDark : gem.glow
        const isOn = !!formData.autonomie

        const containerBg = isOn
          ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.18 : 0.22}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.12 : 0.14}) 100%)`
          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
        const containerBorder = isOn
          ? `1px solid rgba(${glowRGB},${isDark ? 0.3 : 0.25})`
          : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
        const containerShadow = isOn
          ? `0 0 16px rgba(${glowRGB},${isDark ? 0.2 : 0.1}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.3})`
          : `inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.04 : 0.3})`

        const trackBg = isOn
          ? `linear-gradient(135deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.7 : 0.8}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.55 : 0.65}) 100%)`
          : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
        const trackShadow = isOn
          ? `0 0 10px rgba(${glowRGB},${isDark ? 0.4 : 0.25}), inset 0 1px 2px rgba(0,0,0,0.1)`
          : 'inset 0 1px 2px rgba(0,0,0,0.08)'

        const textColor = isOn
          ? (isDark ? gem.textDark : gem.text)
          : (isDark ? '#A1A1AA' : '#6B7280')
        const infoColor = isOn
          ? `rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.6 : 0.5})`
          : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)')

        return (
          <div
            className="flex items-center justify-between p-4 rounded-xl transition-all duration-300"
            style={{ background: containerBg, border: containerBorder, boxShadow: containerShadow }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold transition-colors duration-300" style={{ color: textColor }}>
                {t.autonomy}
              </span>
              <div className="group relative">
                <Info className="w-4 h-4 cursor-help transition-colors duration-300" style={{ color: infoColor }} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-[250px] text-center">
                  {t.autonomyDesc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormData({ autonomie: !formData.autonomie })}
              className="relative w-14 h-7 rounded-full transition-all duration-300 active:scale-[0.96]"
              style={{ background: trackBg, boxShadow: trackShadow }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full shadow-sm transition-transform duration-300"
                style={{
                  transform: `translateX(${isOn ? '30px' : '4px'})`,
                  background: isOn
                    ? `linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.92) 100%)`
                    : '#fff',
                  boxShadow: isOn
                    ? `0 1px 3px rgba(0,0,0,0.15), 0 0 4px rgba(${glowRGB},0.2)`
                    : '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>
        )
      })()}
    </div>
  )
}
