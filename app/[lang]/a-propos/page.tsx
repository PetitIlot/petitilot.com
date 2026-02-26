'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, ShieldCheck, CreditCard, Database, Globe, Server,
  Lock, Users, Sparkles, BarChart2, FileDown, Search, TrendingUp,
  CheckCircle2, UserCheck, Mail, ArrowDown, Layers, Zap,
  SlidersHorizontal, Heart, Download, Star, Eye, Tag,
  Palette, ImageIcon, DollarSign, PieChart, ExternalLink,
  GitBranch, Code2, Shield, Brush, BookOpen, Package,
  Filter, Clock, FolderOpen, Settings, Bell, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Language } from '@/lib/types'

/* ─── Grain overlay ───────────────────────────────────────────────────── */
const GRAIN_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E`

const Grain = ({ opacity = 0.04 }: { opacity?: number }) => (
  <div aria-hidden style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity, borderRadius: 'inherit',
    backgroundImage: `url("${GRAIN_URL}")`,
    backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
  }} />
)

/* ─── Animated counter ────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const dur = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setVal(Math.round(ease * to))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Animation presets ──────────────────────────────────────────────── */
const ease4 = [0.16, 1, 0.3, 1] as [number, number, number, number]
const spring = { type: 'spring' as const, stiffness: 280, damping: 28 }
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: ease4 },
  }),
}
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: ease4 },
  }),
}
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: ease4 },
  }),
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.07, ease: ease4 },
  }),
}

/* ─── Section pill divider ───────────────────────────────────────────── */
const SectionPill = ({ label, color, bgColor }: { label: string; color: string; bgColor: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={spring}
    className="flex items-center justify-center py-10 md:py-14"
  >
    <span className="relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-tight overflow-hidden"
      style={{ background: bgColor, color, boxShadow: `0 0 0 1px ${color}22, 0 4px 16px ${color}20` }}>
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
      {label}
    </span>
  </motion.div>
)

/* ─── Glass widget wrapper ───────────────────────────────────────────── */
const GlassWidget = ({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) => (
  <motion.div
    custom={delay}
    initial="hidden" whileInView="visible" viewport={{ once: true }}
    variants={scaleIn}
    whileHover={{ y: -4, transition: spring }}
    className={`card-huly relative overflow-hidden rounded-2xl ${className}`}
  >
    <Grain opacity={0.035} />
    {children}
  </motion.div>
)

/* ─── Mini bar chart (CSS only) ──────────────────────────────────────── */
const MiniBarChart = ({ values, color }: { values: number[]; color: string }) => (
  <div className="flex items-end gap-[3px] h-10">
    {values.map((v, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        whileInView={{ height: `${v}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: ease4 }}
        className="w-[6px] rounded-full"
        style={{ background: `${color}`, opacity: 0.3 + (v / 100) * 0.7 }}
      />
    ))}
  </div>
)

/* ═══════════════════════════════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════════════════════════════ */
const T: Record<string, {
  eyebrow: string; hero: string; pitch: string
  stats: { val: number; suffix: string; label: string }[]
  objTitle: string; objPoints: { icon: string; head: string; body: string }[]
  familleLabel: string; familleIntro: string
  familleFeatures: { icon: string; title: string; desc: string; detail: string }[]
  familleFormats: string; familleFav: string; familleLib: string; familleHistory: string
  createurLabel: string; createurIntro: string
  createurFeatures: { icon: string; title: string; desc: string; detail: string }[]
  dashRevenue: string; dashSales: string; dashViews: string; dashRating: string
  dashRecent: string; dashPayout: string
  revenueLabel: string
  revenueItems: { pct: string; desc: string; color: string }[]
  revenueSub: string
  secTitle: string
  secItems: { icon: string; val: string; unit: string; body: string; color: string }[]
  stackTitle: string; stackSub: string; stackOpen: string; stackOpenDesc: string
  ctaFamTitle: string; ctaFamSub: string; ctaFamBtn: string
  ctaCrTitle: string; ctaCrSub: string; ctaCrBtn: string; ctaContact: string
}> = {
  fr: {
    eyebrow: 'Transparence totale',
    hero: 'Petit Îlot\nen clair.',
    pitch: 'Une marketplace de ressources pédagogiques pour 0-6 ans. Des créateurs spécialisés publient, les familles téléchargent.',
    stats: [
      { val: 500, suffix: '+', label: 'Ressources' },
      { val: 10, suffix: 'k+', label: 'Familles' },
      { val: 50, suffix: '+', label: 'Créateurs' },
      { val: 25, suffix: 'k+', label: 'Téléchargements' },
    ],
    objTitle: 'L\'objectif',
    objPoints: [
      { icon: 'layers', head: 'Centraliser', body: 'Regrouper les ressources d\'éveil éparpillées sur Pinterest, Instagram, Etsy.' },
      { icon: 'zap', head: 'Rémunérer', body: 'Payer équitablement les créateurs. 90 % de chaque vente leur revient.' },
      { icon: 'globe', head: 'Simplifier', body: 'Filtres âge + compétence. Téléchargement immédiat. Aucun abonnement.' },
    ],
    familleLabel: 'Côté famille',
    familleIntro: 'Tout est pensé pour trouver la bonne activité en quelques secondes — et la télécharger instantanément.',
    familleFeatures: [
      { icon: 'filter', title: 'Filtres granulaires', desc: 'Par âge précis, compétence, type, langue, créateur', detail: '0-3 mois · 3-6 mois · 6-12 mois · 1-2 ans · 2-3 ans · 3-6 ans' },
      { icon: 'eye', title: 'Aperçu détaillé', desc: 'Prévisualisation, objectifs pédagogiques, matériel nécessaire', detail: 'Chaque fiche détaille le temps estimé, l\'âge cible et les compétences travaillées.' },
      { icon: 'download', title: 'Téléchargement immédiat', desc: 'PDF haute résolution, prêt à imprimer', detail: 'URLs signées à durée limitée. Accès illimité depuis votre bibliothèque.' },
      { icon: 'heart', title: 'Bibliothèque personnelle', desc: 'Favoris, historique, collections personnalisées', detail: 'Retrouvez vos achats, organisez par thème, accédez hors-ligne.' },
      { icon: 'tag', title: 'Prix accessibles', desc: 'Pas d\'abonnement. Achat à l\'unité ou packs.', detail: 'Les créateurs fixent leurs prix. Moyenne : 3-8 € par ressource.' },
      { icon: 'shield', title: 'Qualité vérifiée', desc: 'Chaque ressource est validée par l\'équipe avant publication', detail: 'Critères : exactitude pédagogique, design, lisibilité, originalité.' },
    ],
    familleFormats: 'Formats supportés',
    familleFav: 'Favoris',
    familleLib: 'Ma bibliothèque',
    familleHistory: 'Historique',
    createurLabel: 'Côté créateur',
    createurIntro: 'Un vrai outil de travail. Dashboard complet, statistiques en temps réel, gestion des ressources et des revenus.',
    createurFeatures: [
      { icon: 'palette', title: 'Éditeur de fiches', desc: 'Upload multi-fichiers, aperçu, métadonnées pédagogiques', detail: 'Glissez-déposez vos fichiers. Ajoutez titre, description, objectifs, matériel requis.' },
      { icon: 'chart', title: 'Analytics en temps réel', desc: 'Ventes, revenus, vues, taux de conversion', detail: 'Graphiques quotidiens/mensuels. Export CSV. Comparaison période par période.' },
      { icon: 'dollar', title: 'Revenus & virements', desc: 'Stripe Connect. Virements automatiques, historique.', detail: 'Seuil minimum : 10 €. Virements hebdomadaires vers votre compte bancaire.' },
      { icon: 'profile', title: 'Page créateur publique', desc: 'Votre mini-boutique avec bio, avatar, catalogue complet', detail: 'URL personnalisée. Lien direct partageable sur vos réseaux.' },
      { icon: 'settings', title: 'Contrôle total des prix', desc: 'Fixez, modifiez, créez des promotions', detail: 'Prix libre. Possibilité de packs et de réductions temporaires.' },
      { icon: 'bell', title: 'Notifications', desc: 'Nouvelle vente, commentaire, paiement reçu', detail: 'Par email et dans le dashboard. Configurables.' },
    ],
    dashRevenue: 'Revenus ce mois',
    dashSales: 'Ventes',
    dashViews: 'Vues',
    dashRating: 'Note',
    dashRecent: 'Ventes récentes',
    dashPayout: 'Prochain virement',
    revenueLabel: 'Le modèle',
    revenueItems: [
      { pct: '90 %', desc: 'au créateur', color: '#7A8B6F' },
      { pct: '10 %', desc: 'à la plateforme', color: '#9B7EC8' },
    ],
    revenueSub: 'Sans abonnement ni frais fixe. Paiement à l\'acte uniquement.',
    secTitle: 'Données & sécurité',
    secItems: [
      { icon: 'card', val: '0', unit: 'donnée bancaire', body: 'Stripe gère l\'intégralité du flux. Vos coordonnées de paiement ne transitent pas par nos serveurs.', color: '#C9A092' },
      { icon: 'lock', val: 'JWT', unit: '+ bcrypt', body: 'Auth via Supabase. Mots de passe hashés. Sessions JWT signées côté serveur.', color: '#9B7EC8' },
      { icon: 'shield', val: 'URLs', unit: 'signées', body: 'Chaque téléchargement est servi via une URL à durée limitée. Impossible à scraper ou partager.', color: '#5AC8FA' },
      { icon: 'db', val: '3', unit: 'types de données', body: 'Email · historique d\'achats · favoris. Rien d\'autre n\'est collecté ni revendu.', color: '#7A8B6F' },
    ],
    stackTitle: 'Infrastructure',
    stackSub: 'Stack moderne, open-source, performante. Chaque brique est choisie pour sa fiabilité et sa transparence.',
    stackOpen: 'Open Source',
    stackOpenDesc: 'Le code source de Petit Îlot est entièrement public. Inspectez, contribuez, forkez.',
    ctaFamTitle: 'Explorer les ressources',
    ctaFamSub: 'Des centaines de fiches prêtes à imprimer.',
    ctaFamBtn: 'Parcourir',
    ctaCrTitle: 'Devenir créateur',
    ctaCrSub: 'Publiez vos ressources. Encaissez 90 %.',
    ctaCrBtn: 'Candidater — gratuit',
    ctaContact: 'Une question ?',
  },
  en: {
    eyebrow: 'Full transparency',
    hero: 'Petit Îlot\nclearly.',
    pitch: 'A marketplace of educational resources for ages 0-6. Specialized creators publish, families download.',
    stats: [
      { val: 500, suffix: '+', label: 'Resources' },
      { val: 10, suffix: 'k+', label: 'Families' },
      { val: 50, suffix: '+', label: 'Creators' },
      { val: 25, suffix: 'k+', label: 'Downloads' },
    ],
    objTitle: 'The objective',
    objPoints: [
      { icon: 'layers', head: 'Centralize', body: 'Gather early-learning resources scattered across Pinterest, Instagram, Etsy.' },
      { icon: 'zap', head: 'Compensate', body: 'Pay creators fairly. 90% of every sale goes to them.' },
      { icon: 'globe', head: 'Simplify', body: 'Age + skill filters. Instant download. No subscription.' },
    ],
    familleLabel: 'For families',
    familleIntro: 'Everything is designed to find the right activity in seconds — and download it instantly.',
    familleFeatures: [
      { icon: 'filter', title: 'Granular filters', desc: 'By precise age, skill, type, language, creator', detail: '0-3 mo · 3-6 mo · 6-12 mo · 1-2 yr · 2-3 yr · 3-6 yr' },
      { icon: 'eye', title: 'Detailed preview', desc: 'Preview, learning objectives, required materials', detail: 'Each sheet details estimated time, target age and skills addressed.' },
      { icon: 'download', title: 'Instant download', desc: 'High-resolution PDF, ready to print', detail: 'Time-limited signed URLs. Unlimited access from your library.' },
      { icon: 'heart', title: 'Personal library', desc: 'Favorites, history, custom collections', detail: 'Find your purchases, organize by theme, access offline.' },
      { icon: 'tag', title: 'Accessible pricing', desc: 'No subscription. Buy individually or in packs.', detail: 'Creators set their prices. Average: €3-8 per resource.' },
      { icon: 'shield', title: 'Verified quality', desc: 'Each resource is validated by the team before publishing', detail: 'Criteria: pedagogical accuracy, design, readability, originality.' },
    ],
    familleFormats: 'Supported formats',
    familleFav: 'Favorites',
    familleLib: 'My library',
    familleHistory: 'History',
    createurLabel: 'For creators',
    createurIntro: 'A real working tool. Full dashboard, real-time statistics, resource and revenue management.',
    createurFeatures: [
      { icon: 'palette', title: 'Sheet editor', desc: 'Multi-file upload, preview, pedagogical metadata', detail: 'Drag and drop your files. Add title, description, goals, required materials.' },
      { icon: 'chart', title: 'Real-time analytics', desc: 'Sales, revenue, views, conversion rate', detail: 'Daily/monthly charts. CSV export. Period-over-period comparison.' },
      { icon: 'dollar', title: 'Revenue & payouts', desc: 'Stripe Connect. Automatic payouts, history.', detail: 'Minimum threshold: €10. Weekly transfers to your bank account.' },
      { icon: 'profile', title: 'Public creator page', desc: 'Your mini-shop with bio, avatar, full catalog', detail: 'Custom URL. Direct shareable link for your networks.' },
      { icon: 'settings', title: 'Full price control', desc: 'Set, modify, create promotions', detail: 'Free pricing. Option for packs and temporary discounts.' },
      { icon: 'bell', title: 'Notifications', desc: 'New sale, comment, payment received', detail: 'By email and in-dashboard. Configurable.' },
    ],
    dashRevenue: 'Revenue this month',
    dashSales: 'Sales',
    dashViews: 'Views',
    dashRating: 'Rating',
    dashRecent: 'Recent sales',
    dashPayout: 'Next payout',
    revenueLabel: 'The model',
    revenueItems: [
      { pct: '90%', desc: 'to creator', color: '#7A8B6F' },
      { pct: '10%', desc: 'to platform', color: '#9B7EC8' },
    ],
    revenueSub: 'No subscription or fixed fee. Pay-per-download only.',
    secTitle: 'Data & security',
    secItems: [
      { icon: 'card', val: '0', unit: 'banking data', body: 'Stripe handles the entire flow. Your payment details never transit through our servers.', color: '#C9A092' },
      { icon: 'lock', val: 'JWT', unit: '+ bcrypt', body: 'Auth via Supabase. Hashed passwords. Server-signed JWT sessions.', color: '#9B7EC8' },
      { icon: 'shield', val: 'Signed', unit: 'URLs', body: 'Each download is served via a time-limited signed URL. Cannot be scraped or shared.', color: '#5AC8FA' },
      { icon: 'db', val: '3', unit: 'data types', body: 'Email · purchase history · favorites. Nothing else collected or sold.', color: '#7A8B6F' },
    ],
    stackTitle: 'Infrastructure',
    stackSub: 'Modern, open-source, performant stack. Each component is chosen for reliability and transparency.',
    stackOpen: 'Open Source',
    stackOpenDesc: 'Petit Îlot\'s source code is entirely public. Inspect, contribute, fork.',
    ctaFamTitle: 'Explore resources',
    ctaFamSub: 'Hundreds of ready-to-print sheets.',
    ctaFamBtn: 'Browse',
    ctaCrTitle: 'Become a creator',
    ctaCrSub: 'Publish your resources. Earn 90%.',
    ctaCrBtn: 'Apply — it\'s free',
    ctaContact: 'Have a question?',
  },
  es: {
    eyebrow: 'Transparencia total',
    hero: 'Petit Îlot\ncon claridad.',
    pitch: 'Un marketplace de recursos educativos para 0-6 años. Creadores especializados publican, las familias descargan.',
    stats: [
      { val: 500, suffix: '+', label: 'Recursos' },
      { val: 10, suffix: 'k+', label: 'Familias' },
      { val: 50, suffix: '+', label: 'Creadores' },
      { val: 25, suffix: 'k+', label: 'Descargas' },
    ],
    objTitle: 'El objetivo',
    objPoints: [
      { icon: 'layers', head: 'Centralizar', body: 'Reunir recursos de estimulación dispersos en Pinterest, Instagram, Etsy.' },
      { icon: 'zap', head: 'Remunerar', body: 'Pagar equitativamente a los creadores. El 90% de cada venta es para ellos.' },
      { icon: 'globe', head: 'Simplificar', body: 'Filtros edad + habilidad. Descarga inmediata. Sin suscripción.' },
    ],
    familleLabel: 'Para familias',
    familleIntro: 'Todo está pensado para encontrar la actividad correcta en segundos — y descargarla al instante.',
    familleFeatures: [
      { icon: 'filter', title: 'Filtros granulares', desc: 'Por edad precisa, habilidad, tipo, idioma, creador', detail: '0-3 m · 3-6 m · 6-12 m · 1-2 a · 2-3 a · 3-6 a' },
      { icon: 'eye', title: 'Vista previa detallada', desc: 'Previsualización, objetivos pedagógicos, materiales', detail: 'Cada ficha detalla tiempo estimado, edad objetivo y competencias.' },
      { icon: 'download', title: 'Descarga inmediata', desc: 'PDF alta resolución, listo para imprimir', detail: 'URLs firmadas con tiempo limitado. Acceso ilimitado desde tu biblioteca.' },
      { icon: 'heart', title: 'Biblioteca personal', desc: 'Favoritos, historial, colecciones personalizadas', detail: 'Recupera tus compras, organiza por tema, accede sin conexión.' },
      { icon: 'tag', title: 'Precios accesibles', desc: 'Sin suscripción. Compra individual o packs.', detail: 'Los creadores fijan sus precios. Promedio: 3-8 € por recurso.' },
      { icon: 'shield', title: 'Calidad verificada', desc: 'Cada recurso es validado por el equipo antes de publicarse', detail: 'Criterios: exactitud pedagógica, diseño, legibilidad, originalidad.' },
    ],
    familleFormats: 'Formatos soportados',
    familleFav: 'Favoritos',
    familleLib: 'Mi biblioteca',
    familleHistory: 'Historial',
    createurLabel: 'Para creadores',
    createurIntro: 'Una herramienta de trabajo real. Dashboard completo, estadísticas en tiempo real, gestión de recursos e ingresos.',
    createurFeatures: [
      { icon: 'palette', title: 'Editor de fichas', desc: 'Carga multi-archivo, vista previa, metadatos pedagógicos', detail: 'Arrastra y suelta archivos. Agrega título, descripción, objetivos, materiales.' },
      { icon: 'chart', title: 'Analytics en tiempo real', desc: 'Ventas, ingresos, vistas, tasa de conversión', detail: 'Gráficos diarios/mensuales. Exportar CSV. Comparación periodo a periodo.' },
      { icon: 'dollar', title: 'Ingresos y pagos', desc: 'Stripe Connect. Pagos automáticos, historial.', detail: 'Umbral mínimo: 10 €. Transferencias semanales a tu cuenta bancaria.' },
      { icon: 'profile', title: 'Página pública de creador', desc: 'Tu mini-tienda con bio, avatar, catálogo completo', detail: 'URL personalizada. Enlace directo para compartir en redes.' },
      { icon: 'settings', title: 'Control total de precios', desc: 'Establece, modifica, crea promociones', detail: 'Precio libre. Opción de packs y descuentos temporales.' },
      { icon: 'bell', title: 'Notificaciones', desc: 'Nueva venta, comentario, pago recibido', detail: 'Por email y en el dashboard. Configurables.' },
    ],
    dashRevenue: 'Ingresos este mes',
    dashSales: 'Ventas',
    dashViews: 'Vistas',
    dashRating: 'Nota',
    dashRecent: 'Ventas recientes',
    dashPayout: 'Próximo pago',
    revenueLabel: 'El modelo',
    revenueItems: [
      { pct: '90%', desc: 'al creador', color: '#7A8B6F' },
      { pct: '10%', desc: 'a la plataforma', color: '#9B7EC8' },
    ],
    revenueSub: 'Sin suscripción ni tarifa fija. Solo pago por descarga.',
    secTitle: 'Datos y seguridad',
    secItems: [
      { icon: 'card', val: '0', unit: 'datos bancarios', body: 'Stripe gestiona todo el flujo. Tus datos de pago no transitan por nuestros servidores.', color: '#C9A092' },
      { icon: 'lock', val: 'JWT', unit: '+ bcrypt', body: 'Auth vía Supabase. Contraseñas hasheadas. Sesiones JWT firmadas.', color: '#9B7EC8' },
      { icon: 'shield', val: 'URLs', unit: 'firmadas', body: 'Cada descarga tiene URL de tiempo limitado. Imposible de compartir o scraper.', color: '#5AC8FA' },
      { icon: 'db', val: '3', unit: 'tipos de datos', body: 'Email · historial de compras · favoritos. Nada más se recopila ni se vende.', color: '#7A8B6F' },
    ],
    stackTitle: 'Infraestructura',
    stackSub: 'Stack moderna, open-source, performante. Cada componente elegido por fiabilidad y transparencia.',
    stackOpen: 'Open Source',
    stackOpenDesc: 'El código fuente de Petit Îlot es completamente público. Inspecciona, contribuye, haz fork.',
    ctaFamTitle: 'Explorar recursos',
    ctaFamSub: 'Cientos de fichas listas para imprimir.',
    ctaFamBtn: 'Explorar',
    ctaCrTitle: 'Convertirse en creador',
    ctaCrSub: 'Publica tus recursos. Gana el 90%.',
    ctaCrBtn: 'Candidatarse — gratis',
    ctaContact: '¿Una pregunta?',
  },
}

/* ─── Icon maps ───────────────────────────────────────────────────────── */
const stepIcons: Record<string, React.ElementType> = {
  search: Search, card: CreditCard, download: FileDown,
  apply: Mail, approve: UserCheck, publish: Sparkles, earn: TrendingUp,
  layers: Layers, zap: Zap, globe: Globe,
  filter: SlidersHorizontal, eye: Eye, heart: Heart, tag: Tag, shield: ShieldCheck,
  palette: Palette, chart: BarChart2, dollar: DollarSign, profile: Users,
  settings: Settings, bell: Bell,
}
const secIcons: Record<string, React.ElementType> = {
  card: CreditCard, lock: Lock, shield: ShieldCheck, db: Database,
}

/* ─── Tech stack data ────────────────────────────────────────────────── */
const STACK = [
  {
    name: 'Next.js 15',
    role: 'Interface & routing',
    desc: 'App Router, Server Components, streaming SSR, optimisations image automatiques.',
    color: '#000000',
    lightColor: '#F0F0F0',
    url: 'https://nextjs.org',
    logo: '▲',
  },
  {
    name: 'Supabase',
    role: 'Base de données & auth',
    desc: 'PostgreSQL managé, authentification JWT, Row Level Security, temps réel.',
    color: '#3ECF8E',
    lightColor: '#EDFAF4',
    url: 'https://supabase.com',
    logo: '⚡',
  },
  {
    name: 'Stripe',
    role: 'Paiements',
    desc: 'Checkout sécurisé, Stripe Connect pour les créateurs, webhooks temps réel.',
    color: '#635BFF',
    lightColor: '#EFEEFD',
    url: 'https://stripe.com',
    logo: '💳',
  },
  {
    name: 'Cloudinary',
    role: 'Médias & fichiers',
    desc: 'CDN global, transformation d\'images à la volée, stockage sécurisé des ressources.',
    color: '#3448C5',
    lightColor: '#EEF0FB',
    url: 'https://cloudinary.com',
    logo: '☁️',
  },
  {
    name: 'Vercel',
    role: 'Hébergement & CDN',
    desc: 'Deploy atomique sur git push, edge network mondial, analytics intégrés.',
    color: '#000000',
    lightColor: '#F0F0F0',
    url: 'https://vercel.com',
    logo: '▲',
  },
  {
    name: 'GitHub',
    role: 'Code & versioning',
    desc: 'Dépôt public, CI/CD, issues tracker, contributions bienvenues.',
    color: '#24292E',
    lightColor: '#F0F0F0',
    url: 'https://github.com/petit-ilot',
    logo: '🐙',
  },
]

/* ═══════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState<Language>('fr')
  useEffect(() => { params.then(({ lang: l }) => setLang(l as Language)) }, [params])
  const tr = T[lang] ?? T.fr

  /* Parallax for hero */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-32 md:pb-44 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-24 w-[800px] h-[600px] rounded-full opacity-30 blur-[180px]"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(122,139,111,0.5) 0%, transparent 70%)' }} />
          <div className="absolute top-20 right-0 w-[600px] h-[500px] rounded-full opacity-20 blur-[140px]"
            style={{ background: 'radial-gradient(ellipse, rgba(168,146,203,0.5) 0%, transparent 70%)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: ease4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-8"
              style={{ background: 'var(--icon-bg-sage)', color: 'var(--sage)', border: '1px solid rgba(122,139,111,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {tr.eyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: ease4 }}
              className="text-foreground dark:text-foreground-dark whitespace-pre-line mb-6"
              style={{ fontSize: 'clamp(48px, 7vw, 80px)', letterSpacing: '-0.04em', lineHeight: 1.0, fontWeight: 700 }}
            >
              {tr.hero}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: ease4 }}
              className="text-body-large text-foreground-secondary dark:text-foreground-dark-secondary max-w-md leading-relaxed"
            >
              {tr.pitch}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats strip */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 -mb-16 md:-mb-20 mt-14 md:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tr.stats.map((s, i) => (
              <motion.div
                key={i} custom={i} initial="hidden" animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: (idx: number) => ({
                    opacity: 1, y: 0, scale: 1,
                    transition: { duration: 0.7, delay: 0.4 + idx * 0.1, ease: ease4 },
                  }),
                }}
                whileHover={{ y: -6, scale: 1.03, transition: spring }}
                className="card-huly relative overflow-hidden rounded-2xl py-6 px-5 cursor-default"
              >
                <Grain opacity={0.035} />
                <p className="text-[34px] font-bold tracking-tight mb-1 leading-none relative z-10" style={{ color: 'var(--sage)', letterSpacing: '-0.03em' }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wider relative z-10">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          OBJECTIF — Asymmetric bento
      ══════════════════════════════════════════ */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-widest text-foreground-secondary dark:text-foreground-dark-secondary mb-8"
          >
            {tr.objTitle}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {(() => {
              const pt = tr.objPoints[0]
              const Icon = stepIcons[pt.icon] ?? Globe
              return (
                <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
                  whileHover={{ y: -6, transition: spring }}
                  className="lg:col-span-3 card-huly relative overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col gap-5 min-h-[240px]"
                >
                  <Grain />
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(122,139,111,0.4) 0%, transparent 70%)' }} />
                  <div className="absolute -right-4 -top-6 text-[140px] font-black leading-none select-none pointer-events-none"
                    style={{ color: 'var(--sage)', opacity: 0.04, letterSpacing: '-0.05em' }}>01</div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--icon-bg-sage)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--icon-sage)' }} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[20px] font-bold text-foreground dark:text-foreground-dark mb-2" style={{ letterSpacing: '-0.02em' }}>{pt.head}</p>
                    <p className="text-[14px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-sm">{pt.body}</p>
                  </div>
                </motion.div>
              )
            })()}

            <div className="lg:col-span-2 flex flex-col gap-3">
              {tr.objPoints.slice(1).map((pt, i) => {
                const Icon = stepIcons[pt.icon] ?? Globe
                const accents = [
                  { iconBg: 'var(--icon-bg-terracotta)', iconCol: 'var(--icon-terracotta)', num: '02' },
                  { iconBg: 'var(--icon-bg-sky)', iconCol: 'var(--icon-sky)', num: '03' },
                ]
                return (
                  <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}
                    whileHover={{ y: -4, transition: spring }}
                    className="card-huly relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 flex-1"
                  >
                    <Grain />
                    <div className="absolute -top-6 -right-4 text-[80px] font-black leading-none select-none pointer-events-none"
                      style={{ color: 'var(--foreground)', opacity: 0.03 }}>{accents[i].num}</div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accents[i].iconBg }}>
                      <Icon className="w-5 h-5" style={{ color: accents[i].iconCol }} />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground dark:text-foreground-dark mb-1">{pt.head}</p>
                      <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">{pt.body}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CÔTÉ FAMILLE — Detailed features + UI mockups
      ══════════════════════════════════════════ */}
      <SectionPill label={tr.familleLabel} color="#5AC8FA" bgColor="rgba(90,200,250,0.1)" />

      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[15px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-2xl mb-10"
          >
            {tr.familleIntro}
          </motion.p>

          {/* ── Feature grid: 2 cols on desktop, each feature is a glass card ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {tr.familleFeatures.map((feat, i) => {
              const Icon = stepIcons[feat.icon] ?? Globe
              return (
                <GlassWidget key={i} delay={i} className="p-6 group cursor-default">
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(90,200,250,0.3), transparent)' }} />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(90,200,250,0.12)' }}>
                      <Icon className="w-[18px] h-[18px]" style={{ color: 'var(--icon-sky)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground dark:text-foreground-dark mb-1">{feat.title}</p>
                      <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed mb-2">{feat.desc}</p>
                      <p className="text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                        {feat.detail}
                      </p>
                    </div>
                  </div>
                </GlassWidget>
              )
            })}
          </div>

          {/* ── UI Mockup: Filter bar + Resource preview ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="card-huly relative overflow-hidden rounded-3xl p-6 md:p-8"
          >
            <Grain opacity={0.03} />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(90,200,250,0.5) 0%, transparent 70%)' }} />

            {/* Fake filter bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 relative z-10">
              <div className="card-glass-body rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] font-medium text-foreground dark:text-foreground-dark">
                <SlidersHorizontal className="w-3 h-3 opacity-50" />
                <span>0-3 ans</span>
              </div>
              <div className="card-glass-body rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] font-medium text-foreground dark:text-foreground-dark">
                <BookOpen className="w-3 h-3 opacity-50" />
                <span>Motricité</span>
              </div>
              <div className="card-glass-body rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] font-medium text-foreground dark:text-foreground-dark">
                <Package className="w-3 h-3 opacity-50" />
                <span>PDF</span>
              </div>
              <div className="card-glass-body rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary opacity-60">
                <Filter className="w-3 h-3" />
                <span>+ filtres</span>
              </div>
            </div>

            {/* Fake resource cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              {[
                { title: 'Parcours sensoriel', age: '6-12 mois', price: '4,90 €', rating: '4.8' },
                { title: 'Cartes de nomenclature', age: '1-2 ans', price: '3,50 €', rating: '4.9' },
                { title: 'Jeu de tri Montessori', age: '2-3 ans', price: '5,90 €', rating: '4.7' },
                { title: 'Imagier des saisons', age: '0-3 ans', price: '2,90 €', rating: '5.0' },
              ].map((item, i) => (
                <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
                  className="card-glass-body rounded-xl overflow-hidden"
                >
                  {/* Fake image placeholder */}
                  <div className="h-20 md:h-24 relative"
                    style={{
                      background: `linear-gradient(135deg, ${['rgba(90,200,250,0.15)', 'rgba(122,139,111,0.15)', 'rgba(201,160,146,0.15)', 'rgba(168,146,203,0.15)'][i]} 0%, ${['rgba(122,139,111,0.08)', 'rgba(168,146,203,0.08)', 'rgba(90,200,250,0.08)', 'rgba(201,160,146,0.08)'][i]} 100%)`,
                    }}>
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.8)' }}>
                      <Heart className="w-3 h-3 text-foreground-secondary" />
                    </div>
                    <div className="absolute bottom-2 left-2 card-huly-chip">PDF</div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-foreground dark:text-foreground-dark truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">{item.age}</span>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--sage)' }}>{item.price}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] text-foreground-secondary dark:text-foreground-dark-secondary">{item.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom toolbar mockup */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t relative z-10"
              style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5 text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{tr.familleLib}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary">
                <Heart className="w-3.5 h-3.5" />
                <span>{tr.familleFav}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary">
                <Clock className="w-3.5 h-3.5" />
                <span>{tr.familleHistory}</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-foreground-secondary dark:text-foreground-dark-secondary opacity-50">
                {tr.familleFormats}: PDF · JPEG · PNG
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SÉCURITÉ
      ══════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-widest text-foreground-secondary dark:text-foreground-dark-secondary mb-8"
          >
            {tr.secTitle}
          </motion.p>

          <div className="grid grid-cols-1 gap-3">
            {/* Featured security card */}
            {(() => {
              const item = tr.secItems[0]
              const Icon = secIcons[item.icon] ?? ShieldCheck
              return (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
                  whileHover={{ y: -4, transition: spring }}
                  className="card-huly relative overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6"
                >
                  <Grain opacity={0.04} />
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${item.color}55 0%, transparent 70%)` }} />
                  <div className="flex-shrink-0 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${item.color}18` }}>
                      <Icon className="w-7 h-7" style={{ color: item.color }} />
                    </div>
                    <div>
                      <span className="text-[44px] font-bold leading-none" style={{ color: item.color, letterSpacing: '-0.04em' }}>
                        {item.val}
                      </span>
                      <span className="text-[16px] font-semibold text-foreground dark:text-foreground-dark ml-2">{item.unit}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed md:max-w-md">
                    {item.body}
                  </p>
                </motion.div>
              )
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tr.secItems.slice(1).map((item, i) => {
                const Icon = secIcons[item.icon] ?? ShieldCheck
                return (
                  <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
                    whileHover={{ y: -4, scale: 1.015, transition: spring }}
                    className="card-huly relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <Grain opacity={0.04} />
                    <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl opacity-35 pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${item.color}55 0%, transparent 70%)` }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}18` }}>
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <span className="text-[28px] font-bold leading-none" style={{ color: item.color, letterSpacing: '-0.03em' }}>
                        {item.val}
                      </span>
                      <span className="text-[13px] font-semibold text-foreground dark:text-foreground-dark ml-1.5">{item.unit}</span>
                    </div>
                    <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                      {item.body}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CÔTÉ CRÉATEUR — Dashboard + detailed features
      ══════════════════════════════════════════ */}
      <SectionPill label={tr.createurLabel} color="#7A8B6F" bgColor="rgba(122,139,111,0.1)" />

      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[15px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-2xl mb-10"
          >
            {tr.createurIntro}
          </motion.p>

          {/* ── Dashboard mockup — the big showpiece ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="card-huly relative overflow-hidden rounded-3xl p-5 md:p-8 mb-6"
          >
            <Grain opacity={0.03} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(122,139,111,0.12) 0%, transparent 50%)' }} />

            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--icon-bg-sage)' }}>
                  <BarChart2 className="w-4 h-4" style={{ color: 'var(--icon-sage)' }} />
                </div>
                <span className="text-[13px] font-semibold text-foreground dark:text-foreground-dark">Dashboard créateur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="card-glass-body rounded-lg px-2.5 py-1.5 text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">
                  Février 2026
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 relative z-10">
              {[
                { label: tr.dashRevenue, value: '892 €', trend: '+23%', color: '#7A8B6F', bars: [30, 45, 35, 60, 50, 75, 65, 80, 90, 70, 85, 95] },
                { label: tr.dashSales, value: '347', trend: '+18%', color: '#5AC8FA', bars: [40, 55, 45, 70, 60, 80, 75, 85, 70, 90, 80, 95] },
                { label: tr.dashViews, value: '2.4k', trend: '+31%', color: '#C9A092', bars: [25, 40, 55, 45, 65, 50, 70, 80, 60, 85, 75, 90] },
                { label: tr.dashRating, value: '4.9', trend: '★', color: '#9B7EC8', bars: [85, 88, 90, 87, 92, 89, 91, 93, 88, 95, 90, 94] },
              ].map((stat, i) => (
                <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
                  className="card-glass-body rounded-xl p-3.5 relative overflow-hidden"
                >
                  <p className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[22px] font-bold text-foreground dark:text-foreground-dark leading-none" style={{ letterSpacing: '-0.03em' }}>
                        {stat.value}
                      </p>
                      <span className="text-[10px] font-medium mt-1 inline-block" style={{ color: stat.color }}>{stat.trend}</span>
                    </div>
                    <MiniBarChart values={stat.bars} color={stat.color} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Two-column: Recent sales + Payout card */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
              {/* Recent sales */}
              <div className="md:col-span-3 card-glass-body rounded-xl p-4">
                <p className="text-[11px] font-semibold text-foreground dark:text-foreground-dark mb-3">{tr.dashRecent}</p>
                <div className="space-y-2.5">
                  {[
                    { name: 'Parcours sensoriel nature', time: 'il y a 2h', amount: '+4,41 €' },
                    { name: 'Kit Montessori couleurs', time: 'il y a 5h', amount: '+5,31 €' },
                    { name: 'Imagier des animaux', time: 'hier', amount: '+2,61 €' },
                    { name: 'Fiches graphisme 3 ans', time: 'hier', amount: '+3,51 €' },
                  ].map((sale, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0"
                      style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: `rgba(122,139,111,${0.08 + i * 0.03})` }}>
                          <FileDown className="w-3 h-3" style={{ color: 'var(--sage)' }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-foreground dark:text-foreground-dark">{sale.name}</p>
                          <p className="text-[9px] text-foreground-secondary dark:text-foreground-dark-secondary">{sale.time}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--sage)' }}>{sale.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout + Revenue split */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <div className="card-glass-body rounded-xl p-4 flex-1">
                  <p className="text-[11px] font-semibold text-foreground dark:text-foreground-dark mb-3">{tr.dashPayout}</p>
                  <p className="text-[28px] font-bold leading-none mb-1" style={{ color: 'var(--sage)', letterSpacing: '-0.03em' }}>127,80 €</p>
                  <p className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">Lundi 2 mars 2026</p>
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '72%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5, ease: ease4 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(to right, var(--sage), #5AC8FA)' }}
                    />
                  </div>
                </div>

                {/* Revenue model mini */}
                <div className="card-glass-body rounded-xl p-4">
                  <p className="text-[11px] font-semibold text-foreground dark:text-foreground-dark mb-2">{tr.revenueLabel}</p>
                  <div className="flex gap-2">
                    {tr.revenueItems.map((item, i) => (
                      <div key={i} className="flex-1 text-center py-2 rounded-lg" style={{ background: `${item.color}12` }}>
                        <p className="text-[18px] font-bold leading-none" style={{ color: item.color }}>{item.pct}</p>
                        <p className="text-[9px] text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary mt-2 leading-relaxed">{tr.revenueSub}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Feature grid: 2 cols ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tr.createurFeatures.map((feat, i) => {
              const Icon = stepIcons[feat.icon] ?? Sparkles
              return (
                <GlassWidget key={i} delay={i} className="p-6 group cursor-default">
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(122,139,111,0.3), transparent)' }} />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--icon-bg-sage)' }}>
                      <Icon className="w-[18px] h-[18px]" style={{ color: 'var(--icon-sage)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground dark:text-foreground-dark mb-1">{feat.title}</p>
                      <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed mb-2">{feat.desc}</p>
                      <p className="text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                        {feat.detail}
                      </p>
                    </div>
                  </div>
                </GlassWidget>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INFRASTRUCTURE — Glass widgets with links
      ══════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-widest text-foreground-secondary dark:text-foreground-dark-secondary mb-3"
          >
            {tr.stackTitle}
          </motion.p>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-[14px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-xl mb-10"
          >
            {tr.stackSub}
          </motion.p>

          {/* Stack grid: 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {STACK.map((tech, i) => (
              <motion.a
                key={i}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.02, transition: spring }}
                className="card-huly relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 cursor-pointer group no-underline"
              >
                <Grain opacity={0.035} />

                {/* Brand glow */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[40px] opacity-25 pointer-events-none transition-opacity group-hover:opacity-40"
                  style={{ background: `radial-gradient(circle, ${tech.color}88 0%, transparent 70%)` }} />
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${tech.color}44, transparent)` }} />

                {/* Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{
                        background: tech.color === '#000000' || tech.color === '#24292E'
                          ? 'rgba(0,0,0,0.08)' : `${tech.color}15`,
                      }}>
                      <span>{tech.logo}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-foreground dark:text-foreground-dark">{tech.name}</p>
                      <p className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wider">{tech.role}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-foreground-secondary dark:text-foreground-dark-secondary opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>

                {/* Description */}
                <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed relative z-10">
                  {tech.desc}
                </p>

                {/* Dot indicator */}
                <div className="flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: tech.color === '#000000' || tech.color === '#24292E' ? 'var(--foreground)' : tech.color,
                      boxShadow: `0 0 6px ${tech.color}60`,
                    }} />
                  <span className="text-[10px] font-medium text-foreground-secondary dark:text-foreground-dark-secondary group-hover:text-foreground dark:group-hover:text-foreground-dark transition-colors">
                    {tech.url.replace('https://', '')}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Open Source banner */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="card-huly relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
          >
            <Grain opacity={0.04} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(122,139,111,0.1) 0%, transparent 50%)' }} />

            <div className="flex items-center gap-4 flex-shrink-0 relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--icon-bg-sage)' }}>
                <GitBranch className="w-6 h-6" style={{ color: 'var(--icon-sage)' }} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground dark:text-foreground-dark">{tr.stackOpen}</p>
                <p className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary">{tr.stackOpenDesc}</p>
              </div>
            </div>

            <div className="md:ml-auto flex items-center gap-3 relative z-10">
              <a
                href="https://github.com/petit-ilot/petit-ilot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 card-glass-body rounded-xl px-4 py-2.5 text-[12px] font-semibold text-foreground dark:text-foreground-dark hover:scale-105 transition-transform no-underline"
              >
                <Code2 className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3 opacity-40" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Family CTA */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeLeft}
              whileHover={{ y: -5, transition: spring }}
              className="lg:col-span-2 card-huly relative overflow-hidden rounded-2xl p-8 flex flex-col justify-between gap-8"
            >
              <Grain opacity={0.04} />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-35 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(90,200,250,0.6) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <p className="text-[17px] font-bold text-foreground dark:text-foreground-dark mb-2">{tr.ctaFamTitle}</p>
                <p className="text-[13px] text-foreground-secondary dark:text-foreground-dark-secondary">{tr.ctaFamSub}</p>
              </div>
              <div className="relative z-10">
                <Link href={`/${lang}/activites`}>
                  <Button gem="sky" size="sm">
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    {tr.ctaFamBtn}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Creator CTA — image */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeRight}
              whileHover={{ y: -5, transition: spring }}
              className="lg:col-span-3 rounded-2xl overflow-hidden relative min-h-[240px]"
              style={{ boxShadow: '0 4px 24px rgba(122,139,111,0.25), 0 16px 48px rgba(122,139,111,0.12)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=900&q=75"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(125deg, rgba(50,70,45,0.9) 0%, rgba(20,30,20,0.6) 50%, rgba(122,139,111,0.15) 100%)' }} />
              <Grain opacity={0.06} />

              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-4"
                    style={{ background: 'rgba(122,139,111,0.35)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <BarChart2 className="w-3 h-3" />
                    90 % per sale
                  </div>
                  <p className="text-[22px] font-bold text-white leading-tight mb-1.5" style={{ letterSpacing: '-0.02em' }}>{tr.ctaCrTitle}</p>
                  <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{tr.ctaCrSub}</p>
                </div>
                <div className="flex items-center gap-5 mt-6">
                  <Link href={`/${lang}/devenir-createur`}>
                    <Button gem="sage" size="sm">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {tr.ctaCrBtn}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                  <Link href={`/${lang}/contact`}>
                    <button className="text-[12px] underline underline-offset-4 transition-opacity duration-200 hover:opacity-100 opacity-60"
                      style={{ color: 'white' }}>
                      {tr.ctaContact}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  )
}
