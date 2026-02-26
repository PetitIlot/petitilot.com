'use client'

import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import type { IconProps } from '@phosphor-icons/react'
import {
  Tag,
  // Categories
  Hand, Scissors, PersonSimpleRun, PersonSimpleWalk, PersonSimple,
  PaintBrush, TreeEvergreen, Tree, Recycle, ForkKnife, MaskHappy,
  ClockCountdown, Clock, Printer,
  // Budget
  Sparkle, House, Leaf, Coins, ShoppingCart,
  // Difficulty
  Circle, CircleHalf,
  // Intensity
  Feather,
  // Duration
  Lightning, Timer, HourglassMedium,
  // Themes
  Flower, Sun, Snowflake, Ghost, Heart, Anchor, Crown,
  MusicNote, BookOpen, Hash, TextAa,
  Waves, Rocket, UsersThree, GraduationCap, Car, PawPrint, Plant, Cloud, Egg,
  // Competences
  Brain, Target, Eye, FunnelSimple, ChatCircle, Lightbulb, Star,
  Scales, Pencil, Broom,
  // Materials groups
  FileText, Drop, Wrench,
} from '@phosphor-icons/react'

type PhosphorIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>

// ---- CATÉGORIES (type d'activité) ----
const CATEGORY_ICONS: Record<string, PhosphorIcon> = {
  'sensoriel': Hand,
  'motricite-fine': Scissors,
  'motricite-globale': PersonSimpleRun,
  'art-plastique': PaintBrush,
  'nature-plein-air': TreeEvergreen,
  'diy-recup': Recycle,
  'cuisine': ForkKnife,
  'jeux-symboliques': MaskHappy,
  'rituels-routines': ClockCountdown,
  'imprimables': Printer,
}

// ---- TYPES DE RESSOURCE ----
const RESOURCE_TYPE_ICONS: Record<string, PhosphorIcon> = {
  'activite': Star,
  'motricite': PersonSimpleRun,
  'alimentation': ForkKnife,
}

// ---- TYPES DE BUDGET MATÉRIEL ----
const BUDGET_ICONS: Record<string, PhosphorIcon> = {
  'sans-materiel': Sparkle,
  'maison': House,
  'nature': Leaf,
  'recup': Recycle,
  'petit-budget': Coins,
  'investissement': ShoppingCart,
}

// ---- DIFFICULTÉ ----
const DIFFICULTY_ICONS: Record<string, PhosphorIcon> = {
  'beginner': Circle,
  'advanced': CircleHalf,
  'expert': Circle, // rendu avec weight="fill" via FilterIcon
}

// ---- INTENSITÉ ----
const INTENSITY_ICONS: Record<string, PhosphorIcon> = {
  'leger': Feather,
  'moyen': PersonSimpleWalk,
  'intense': PersonSimpleRun,
}

// ---- DURÉE (valeurs = '15', '30', '60', '120') ----
const DURATION_ICONS: Record<string, PhosphorIcon> = {
  '15': Lightning,
  '30': Timer,
  '60': Clock,
  '120': HourglassMedium,
}

// ---- TEMPS DE PRÉPARATION (valeurs = '0', '5', '15', '30') ----
const PREP_TIME_ICONS: Record<string, PhosphorIcon> = {
  '0': Sparkle,
  '5': Lightning,
  '15': Timer,
  '30': Clock,
}

// ---- THÈMES ----
const THEME_ICONS: Record<string, PhosphorIcon> = {
  'Printemps': Flower,
  'Été': Sun,
  'Automne': Leaf,
  'Hiver': Snowflake,
  'Noël': Tree,
  'Pâques': Egg,
  'Halloween': Ghost,
  'Saint-Valentin': Heart,
  'Fête des mères': Flower,
  'Fête des pères': PersonSimple,
  'Carnaval': MaskHappy,
  'Nature': TreeEvergreen,
  'Animaux': PawPrint,
  'Océan & mer': Waves,
  'Jardin & plantes': Plant,
  'Forêt': TreeEvergreen,
  'Météo': Cloud,
  'Espace': Rocket,
  'Maison': House,
  'Famille': UsersThree,
  'École': GraduationCap,
  'Transports': Car,
  'Alimentation': ForkKnife,
  'Corps humain': PersonSimple,
  'Contes & Histoires': BookOpen,
  'Dinosaures': Star,
  'Pirates': Anchor,
  'Princesses': Crown,
  'Super-héros': Lightning,
  'Musique': MusicNote,
  'Couleurs': PaintBrush,
  'Formes': Hash,
  'Chiffres': Hash,
  'Lettres': TextAa,
}

// ---- COMPÉTENCES ----
const COMPETENCE_ICONS: Record<string, PhosphorIcon> = {
  'Motricité fine': Hand,
  'Motricité globale': PersonSimpleRun,
  'Coordination': Target,
  'Équilibre': Scales,
  'Logique & Maths': Hash,
  'Mémoire': Brain,
  'Concentration': Target,
  'Résolution de problèmes': Lightbulb,
  'Observation': Eye,
  'Tri & classement': FunnelSimple,
  'Langage': ChatCircle,
  'Vocabulaire': BookOpen,
  'Pré-lecture': BookOpen,
  'Pré-écriture': Pencil,
  'Créativité': Lightbulb,
  'Imagination': Cloud,
  'Expression artistique': PaintBrush,
  'Gestion des émotions': Heart,
  'Socialisation': UsersThree,
  'Coopération': UsersThree,
  'Patience': HourglassMedium,
  'Confiance en soi': Star,
  'Autonomie': Star,
  'Vie pratique': Broom,
  'Découverte sensorielle': Eye,
  'Éveil musical': MusicNote,
}

// ---- GROUPES DE MATÉRIAUX (lookup par group) ----
const MATERIAL_GROUP_ICONS: Record<string, PhosphorIcon> = {
  paper: FileText,
  glue: Drop,
  cutting: Scissors,
  drawing: Pencil,
  paint: PaintBrush,
  modeling: Hand,
  sewing: Scissors,
  deco: Star,
  nature: Leaf,
  recycle: Recycle,
  kitchen: ForkKnife,
  sensory: Hand,
  tools: Wrench,
  print: Printer,
}

// Fusion de tous les maps pour lookup unique
const ALL_ICONS: Record<string, PhosphorIcon> = {
  ...CATEGORY_ICONS,
  ...RESOURCE_TYPE_ICONS,
  ...BUDGET_ICONS,
  ...DIFFICULTY_ICONS,
  ...INTENSITY_ICONS,
  ...DURATION_ICONS,
  ...PREP_TIME_ICONS,
  ...THEME_ICONS,
  ...COMPETENCE_ICONS,
  ...MATERIAL_GROUP_ICONS,
}

function findIcon(value: string): PhosphorIcon | null {
  return ALL_ICONS[value] ?? null
}

export interface FilterIconProps {
  value: string
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}

/**
 * Remplace les emojis Unicode par des icônes Phosphor SVG.
 * Lookup dans tous les maps, fallback sur Tag.
 * Cas spécial : 'expert' (difficulté) → Circle avec weight="fill".
 */
export function FilterIcon({ value, size = 16, weight = 'regular', className }: FilterIconProps) {
  const resolvedWeight = value === 'expert' ? 'fill' : weight
  const Icon = findIcon(value) ?? Tag
  return <Icon size={size} weight={resolvedWeight} className={className} />
}
