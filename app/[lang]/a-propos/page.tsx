'use client'

import { useState, useEffect } from 'react'
import { Heart, Tv, Leaf, Users, Mail, ArrowRight, Sparkles, Baby, BookOpen, Palette, Check, Quote } from 'lucide-react'
import { Language } from '@/lib/types'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const translations = {
  fr: {
    // Hero
    title: 'À propos de Petit Îlot',
    subtitle: 'Un havre de ressources pour accompagner vos enfants dans leurs premières années, avec bienveillance et simplicité.',

    // Mission
    ourMission: 'Notre Mission',
    missionText1: "Petit Îlot est né d'une conviction simple : les moments les plus précieux avec nos enfants n'ont pas besoin d'écrans ni de jouets coûteux.",
    missionText2: "Un bac d'eau, de la peinture, une balade en forêt... c'est souvent tout ce qu'il faut pour créer des souvenirs inoubliables et accompagner leur développement naturel.",
    missionText3: "Notre mission est de vous offrir des ressources simples, testées et approuvées, pour que chaque famille puisse créer son propre petit îlot de bonheur.",
    missionText4: "Nous croyons profondément que chaque enfant mérite de grandir à son rythme, entouré de nature, de créativité et d'amour. C'est pourquoi nous sélectionnons avec soin chaque ressource partagée sur notre plateforme.",

    // Story
    ourStory: 'Notre Histoire',
    storyText1: "Tout a commencé dans notre cuisine, entre deux activités de pâte à modeler maison et une expérience de germination. Nous cherchions des idées d'activités adaptées à nos enfants, mais nous nous retrouvions souvent face à des propositions trop complexes, nécessitant du matériel introuvable, ou tout simplement non adaptées à leur âge.",
    storyText2: "Alors nous avons commencé à créer nos propres activités. À les tester. À les améliorer. À les partager avec d'autres parents qui vivaient la même frustration. Les retours enthousiastes nous ont convaincus : il y avait un réel besoin.",
    storyText3: "Petit Îlot est né de cette envie de rassembler en un seul endroit des ressources de qualité, créées par des parents et des éducateurs passionnés, pour des familles en quête d'authenticité et de simplicité.",

    // Values
    ourValues: 'Nos Valeurs',
    valueLess: 'Moins mais mieux',
    valueLessDesc: 'Prendre le temps, ralentir, observer et accompagner nos enfants à leur rythme. Privilégier la qualité des moments partagés plutôt que la quantité d\'activités. Un seul moment de connexion authentique vaut mille distractions.',
    valueNoScreen: 'Sans écran',
    valueNoScreenDesc: 'Des activités pour développer la créativité, l\'imagination et la motricité sans dépendre des écrans. Nous croyons que les mains dans la terre, les yeux dans les étoiles et le cœur dans le jeu sont les meilleurs outils d\'apprentissage.',
    valueNature: 'Connexion à la nature',
    valueNatureDesc: 'Reconnecter les enfants à leur environnement naturel, éveiller leur curiosité et leur respect du vivant. La nature est notre meilleure alliée pour l\'éveil sensoriel et le développement de l\'enfant.',
    valueAuthenticity: 'Authenticité',
    valueAuthenticityDesc: 'Du contenu créé par des parents et éducateurs passionnés, testé avec de vrais enfants. Pas de mise en scène parfaite, juste des moments vrais et des ressources qui fonctionnent réellement.',

    // What we offer
    whatWeOffer: 'Ce que nous proposons',
    offer1Title: 'Activités créatives',
    offer1Desc: 'Des centaines d\'idées d\'activités manuelles, artistiques et sensorielles adaptées à chaque âge de 0 à 6 ans.',
    offer2Title: 'Ressources téléchargeables',
    offer2Desc: 'Des fiches pratiques, des guides pédagogiques et des supports visuels prêts à imprimer.',
    offer3Title: 'Accompagnement personnalisé',
    offer3Desc: 'Des filtres intelligents pour trouver l\'activité parfaite selon l\'âge, le temps disponible et le matériel à la maison.',
    offer4Title: 'Communauté de créateurs',
    offer4Desc: 'Une plateforme qui met en valeur le travail de parents et éducateurs passionnés du monde entier.',

    // Why choose us
    whyChoose: 'Pourquoi Petit Îlot ?',
    reason1: 'Toutes les ressources sont testées avec de vrais enfants',
    reason2: 'Filtres par âge précis (0-6, 6-12, 12-18 mois, etc.)',
    reason3: 'Matériel simple et accessible à tous',
    reason4: 'Activités classées par compétences développées',
    reason5: 'Temps de préparation indiqué pour chaque activité',
    reason6: 'Téléchargements disponibles pour certaines ressources',
    reason7: 'Créateurs vérifiés et passionnés',
    reason8: 'Mises à jour régulières avec de nouvelles idées',

    // Testimonial
    testimonialQuote: '"Petit Îlot a transformé nos après-midis. Fini le stress de trouver une activité, tout est là, bien organisé et adapté à l\'âge de mes enfants."',
    testimonialAuthor: 'Marie, maman de 2 enfants',

    // Team
    ourTeam: 'L\'équipe',
    teamText: 'Petit Îlot est porté par une équipe de parents passionnés, unis par la conviction que l\'enfance mérite le meilleur. Nous travaillons chaque jour pour vous apporter des ressources de qualité, sélectionnées avec soin et amour.',

    // For creators
    forCreators: 'Pour les créateurs',
    creatorsText1: 'Vous êtes parent, éducateur, ou passionné par la petite enfance ? Vous créez des activités, des supports pédagogiques ou des ressources éducatives ?',
    creatorsText2: 'Petit Îlot vous offre une plateforme pour partager vos créations avec des milliers de familles. Rejoignez notre communauté de créateurs et faites partie de l\'aventure.',
    creatorsButton: 'Devenir créateur',

    // Contact
    contactTitle: 'Une question ?',
    contactDesc: 'N\'hésitez pas à nous contacter, nous sommes là pour vous accompagner dans cette belle aventure qu\'est la parentalité.',
    contactButton: 'Nous contacter',

    // Stats
    stats1Label: 'Activités disponibles',
    stats2Label: 'Familles accompagnées',
    stats3Label: 'Créateurs passionnés',
    stats4Label: 'Téléchargements'
  },
  en: {
    // Hero
    title: 'About Petit Îlot',
    subtitle: 'A haven of resources to support your children in their early years, with kindness and simplicity.',

    // Mission
    ourMission: 'Our Mission',
    missionText1: "Petit Îlot was born from a simple belief: the most precious moments with our children don't need screens or expensive toys.",
    missionText2: "A tub of water, some paint, a walk in the forest... that's often all it takes to create unforgettable memories and support their natural development.",
    missionText3: "Our mission is to offer you simple, tested and approved resources, so every family can create their own little island of happiness.",
    missionText4: "We deeply believe that every child deserves to grow at their own pace, surrounded by nature, creativity and love. That's why we carefully select each resource shared on our platform.",

    // Story
    ourStory: 'Our Story',
    storyText1: "It all started in our kitchen, between homemade playdough activities and a germination experiment. We were looking for activity ideas adapted to our children, but we often found ourselves facing proposals that were too complex, requiring hard-to-find materials, or simply not age-appropriate.",
    storyText2: "So we started creating our own activities. Testing them. Improving them. Sharing them with other parents who experienced the same frustration. The enthusiastic feedback convinced us: there was a real need.",
    storyText3: "Petit Îlot was born from this desire to gather quality resources in one place, created by passionate parents and educators, for families seeking authenticity and simplicity.",

    // Values
    ourValues: 'Our Values',
    valueLess: 'Less but better',
    valueLessDesc: 'Taking time, slowing down, observing and supporting our children at their own pace. Prioritizing quality of shared moments over quantity of activities. One moment of authentic connection is worth a thousand distractions.',
    valueNoScreen: 'Screen-free',
    valueNoScreenDesc: 'Activities to develop creativity, imagination and motor skills without relying on screens. We believe that hands in the dirt, eyes on the stars, and heart in the game are the best learning tools.',
    valueNature: 'Connection to nature',
    valueNatureDesc: 'Reconnecting children with their natural environment, awakening their curiosity and respect for living things. Nature is our best ally for sensory awakening and child development.',
    valueAuthenticity: 'Authenticity',
    valueAuthenticityDesc: 'Content created by passionate parents and educators, tested with real children. No perfect staging, just real moments and resources that actually work.',

    // What we offer
    whatWeOffer: 'What we offer',
    offer1Title: 'Creative activities',
    offer1Desc: 'Hundreds of manual, artistic and sensory activity ideas adapted to each age from 0 to 6 years.',
    offer2Title: 'Downloadable resources',
    offer2Desc: 'Practical sheets, educational guides and ready-to-print visual supports.',
    offer3Title: 'Personalized guidance',
    offer3Desc: 'Smart filters to find the perfect activity based on age, available time and materials at home.',
    offer4Title: 'Creator community',
    offer4Desc: 'A platform that showcases the work of passionate parents and educators from around the world.',

    // Why choose us
    whyChoose: 'Why Petit Îlot?',
    reason1: 'All resources are tested with real children',
    reason2: 'Precise age filters (0-6, 6-12, 12-18 months, etc.)',
    reason3: 'Simple and accessible materials',
    reason4: 'Activities classified by developed skills',
    reason5: 'Preparation time indicated for each activity',
    reason6: 'Downloads available for some resources',
    reason7: 'Verified and passionate creators',
    reason8: 'Regular updates with new ideas',

    // Testimonial
    testimonialQuote: '"Petit Îlot has transformed our afternoons. No more stress finding an activity, everything is there, well organized and adapted to my children\'s age."',
    testimonialAuthor: 'Marie, mother of 2 children',

    // Team
    ourTeam: 'The team',
    teamText: 'Petit Îlot is driven by a team of passionate parents, united by the conviction that childhood deserves the best. We work every day to bring you quality resources, carefully selected with care and love.',

    // For creators
    forCreators: 'For creators',
    creatorsText1: 'Are you a parent, educator, or passionate about early childhood? Do you create activities, educational materials or learning resources?',
    creatorsText2: 'Petit Îlot offers you a platform to share your creations with thousands of families. Join our creator community and be part of the adventure.',
    creatorsButton: 'Become a creator',

    // Contact
    contactTitle: 'Have a question?',
    contactDesc: "Don't hesitate to contact us, we're here to support you in this beautiful adventure that is parenting.",
    contactButton: 'Contact us',

    // Stats
    stats1Label: 'Available activities',
    stats2Label: 'Families supported',
    stats3Label: 'Passionate creators',
    stats4Label: 'Downloads'
  },
  es: {
    // Hero
    title: 'Acerca de Petit Îlot',
    subtitle: 'Un refugio de recursos para acompañar a tus hijos en sus primeros años, con amabilidad y sencillez.',

    // Mission
    ourMission: 'Nuestra Misión',
    missionText1: 'Petit Îlot nació de una convicción simple: los momentos más preciados con nuestros hijos no necesitan pantallas ni juguetes caros.',
    missionText2: 'Un recipiente de agua, pintura, un paseo por el bosque... a menudo eso es todo lo que se necesita para crear recuerdos inolvidables y acompañar su desarrollo natural.',
    missionText3: 'Nuestra misión es ofrecerte recursos simples, probados y aprobados, para que cada familia pueda crear su propia pequeña isla de felicidad.',
    missionText4: 'Creemos profundamente que cada niño merece crecer a su propio ritmo, rodeado de naturaleza, creatividad y amor. Por eso seleccionamos cuidadosamente cada recurso compartido en nuestra plataforma.',

    // Story
    ourStory: 'Nuestra Historia',
    storyText1: 'Todo comenzó en nuestra cocina, entre actividades de plastilina casera y un experimento de germinación. Buscábamos ideas de actividades adaptadas a nuestros hijos, pero a menudo nos encontrábamos con propuestas demasiado complejas, que requerían materiales difíciles de encontrar, o simplemente no eran apropiadas para su edad.',
    storyText2: 'Así que empezamos a crear nuestras propias actividades. Probarlas. Mejorarlas. Compartirlas con otros padres que vivían la misma frustración. Los comentarios entusiastas nos convencieron: había una necesidad real.',
    storyText3: 'Petit Îlot nació de este deseo de reunir recursos de calidad en un solo lugar, creados por padres y educadores apasionados, para familias que buscan autenticidad y sencillez.',

    // Values
    ourValues: 'Nuestros Valores',
    valueLess: 'Menos pero mejor',
    valueLessDesc: 'Tomarse el tiempo, ir despacio, observar y acompañar a nuestros hijos a su ritmo. Priorizar la calidad de los momentos compartidos sobre la cantidad de actividades. Un momento de conexión auténtica vale más que mil distracciones.',
    valueNoScreen: 'Sin pantallas',
    valueNoScreenDesc: 'Actividades para desarrollar la creatividad, la imaginación y la motricidad sin depender de las pantallas. Creemos que las manos en la tierra, los ojos en las estrellas y el corazón en el juego son las mejores herramientas de aprendizaje.',
    valueNature: 'Conexión con la naturaleza',
    valueNatureDesc: 'Reconectar a los niños con su entorno natural, despertar su curiosidad y respeto por los seres vivos. La naturaleza es nuestra mejor aliada para el despertar sensorial y el desarrollo del niño.',
    valueAuthenticity: 'Autenticidad',
    valueAuthenticityDesc: 'Contenido creado por padres y educadores apasionados, probado con niños reales. Sin puestas en escena perfectas, solo momentos reales y recursos que realmente funcionan.',

    // What we offer
    whatWeOffer: 'Lo que ofrecemos',
    offer1Title: 'Actividades creativas',
    offer1Desc: 'Cientos de ideas de actividades manuales, artísticas y sensoriales adaptadas a cada edad de 0 a 6 años.',
    offer2Title: 'Recursos descargables',
    offer2Desc: 'Fichas prácticas, guías pedagógicas y soportes visuales listos para imprimir.',
    offer3Title: 'Orientación personalizada',
    offer3Desc: 'Filtros inteligentes para encontrar la actividad perfecta según la edad, el tiempo disponible y los materiales en casa.',
    offer4Title: 'Comunidad de creadores',
    offer4Desc: 'Una plataforma que destaca el trabajo de padres y educadores apasionados de todo el mundo.',

    // Why choose us
    whyChoose: '¿Por qué Petit Îlot?',
    reason1: 'Todos los recursos están probados con niños reales',
    reason2: 'Filtros de edad precisos (0-6, 6-12, 12-18 meses, etc.)',
    reason3: 'Materiales simples y accesibles',
    reason4: 'Actividades clasificadas por competencias desarrolladas',
    reason5: 'Tiempo de preparación indicado para cada actividad',
    reason6: 'Descargas disponibles para algunos recursos',
    reason7: 'Creadores verificados y apasionados',
    reason8: 'Actualizaciones regulares con nuevas ideas',

    // Testimonial
    testimonialQuote: '"Petit Îlot ha transformado nuestras tardes. Se acabó el estrés de encontrar una actividad, todo está ahí, bien organizado y adaptado a la edad de mis hijos."',
    testimonialAuthor: 'María, madre de 2 hijos',

    // Team
    ourTeam: 'El equipo',
    teamText: 'Petit Îlot está impulsado por un equipo de padres apasionados, unidos por la convicción de que la infancia merece lo mejor. Trabajamos cada día para ofrecerte recursos de calidad, seleccionados con cuidado y amor.',

    // For creators
    forCreators: 'Para creadores',
    creatorsText1: '¿Eres padre, educador o apasionado por la primera infancia? ¿Creas actividades, materiales educativos o recursos de aprendizaje?',
    creatorsText2: 'Petit Îlot te ofrece una plataforma para compartir tus creaciones con miles de familias. Únete a nuestra comunidad de creadores y forma parte de la aventura.',
    creatorsButton: 'Convertirse en creador',

    // Contact
    contactTitle: '¿Tienes una pregunta?',
    contactDesc: 'No dudes en contactarnos, estamos aquí para acompañarte en esta hermosa aventura que es la paternidad.',
    contactButton: 'Contáctanos',

    // Stats
    stats1Label: 'Actividades disponibles',
    stats2Label: 'Familias acompañadas',
    stats3Label: 'Creadores apasionados',
    stats4Label: 'Descargas'
  }
}

const values = [
  { key: 'valueLess', icon: Heart, gradient: 'from-sage/20 to-sage/5', iconColor: 'var(--icon-sage)' },
  { key: 'valueNoScreen', icon: Tv, gradient: 'from-sky/20 to-sky/5', iconColor: 'var(--icon-sky)' },
  { key: 'valueNature', icon: Leaf, gradient: 'from-sage/20 to-sage/5', iconColor: 'var(--icon-sage)' },
  { key: 'valueAuthenticity', icon: Users, gradient: 'from-terracotta/20 to-terracotta/5', iconColor: 'var(--icon-terracotta)' }
]

const offers = [
  { key: 'offer1', icon: Palette, iconColor: 'var(--icon-sage)' },
  { key: 'offer2', icon: BookOpen, iconColor: 'var(--icon-sky)' },
  { key: 'offer3', icon: Sparkles, iconColor: 'var(--icon-terracotta)' },
  { key: 'offer4', icon: Users, iconColor: 'var(--icon-sage)' }
]

export default function AboutPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  const reasons = [
    t.reason1, t.reason2, t.reason3, t.reason4,
    t.reason5, t.reason6, t.reason7, t.reason8
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero with gradient */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-background dark:via-background-dark to-sky/10" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-sage/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-terracotta/3 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--icon-bg-sage)' }}>
              <Baby className="w-4 h-4" style={{ color: 'var(--icon-sage)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--icon-sage)' }}>0-6 ans</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-foreground-dark mb-6">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary dark:text-foreground-dark-secondary max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '500+', label: t.stats1Label },
              { value: '10k+', label: t.stats2Label },
              { value: '50+', label: t.stats3Label },
              { value: '25k+', label: t.stats4Label }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-sage mb-1">{stat.value}</p>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image with glassmorphism overlay */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-apple">
                <img
                  src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80"
                  alt="Parent and child"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Glassmorphism card */}
              <div className="absolute -bottom-6 -right-6 md:right-6 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl rounded-2xl p-6 shadow-apple max-w-[260px]" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-sage)' }}>
                    <Heart className="w-5 h-5" style={{ color: 'var(--icon-sage)' }} />
                  </div>
                  <span className="font-semibold text-foreground dark:text-foreground-dark">Simple & efficace</span>
                </div>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                  Des ressources testées avec de vrais enfants, par de vrais parents
                </p>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-sage/20 dark:bg-sage/10 rounded-full -z-10" />
              <div className="absolute -bottom-8 left-1/4 w-16 h-16 bg-sky/20 dark:bg-sky/10 rounded-full -z-10" />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-8">
                {t.ourMission}
              </h2>
              <div className="space-y-6 text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                <p className="text-lg">{t.missionText1}</p>
                <p>{t.missionText2}</p>
                <p>{t.missionText3}</p>
                <p className="text-foreground dark:text-foreground-dark font-medium">{t.missionText4}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-surface-secondary/50 dark:bg-surface-dark/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-4">
              {t.ourStory}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[t.storyText1, t.storyText2, t.storyText3].map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed ${index === 0 ? 'text-lg' : ''}`}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark text-center mb-12 md:mb-16"
          >
            {t.ourValues}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div
                    className={`h-full bg-gradient-to-br ${value.gradient} bg-surface dark:bg-surface-dark rounded-2xl p-8 shadow-apple hover:shadow-apple-hover transition-all duration-300`}
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7" style={{ color: value.iconColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-3">
                          {t[value.key as keyof typeof t]}
                        </h3>
                        <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                          {t[`${value.key}Desc` as keyof typeof t]}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 md:py-24 bg-surface-secondary/50 dark:bg-surface-dark/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark text-center mb-12 md:mb-16"
          >
            {t.whatWeOffer}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => {
              const Icon = offer.icon
              return (
                <motion.div
                  key={offer.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple text-center"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7" style={{ color: offer.iconColor }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t[`${offer.key}Title` as keyof typeof t]}
                  </h3>
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                    {t[`${offer.key}Desc` as keyof typeof t]}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-8">
                {t.whyChoose}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'var(--icon-bg-sage)' }}>
                      <Check className="w-4 h-4" style={{ color: 'var(--icon-sage)' }} />
                    </div>
                    <span className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                      {reason}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-surface dark:bg-surface-dark rounded-3xl p-8 md:p-10 shadow-apple relative"
              style={{ border: '1px solid var(--border)' }}
            >
              <Quote className="w-10 h-10 absolute top-6 left-6 opacity-30" style={{ color: 'var(--icon-sage)' }} />
              <div className="relative z-10">
                <p className="text-lg text-foreground dark:text-foreground-dark leading-relaxed mb-6 italic">
                  {t.testimonialQuote}
                </p>
                <p className="text-sage font-semibold">{t.testimonialAuthor}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-surface-secondary/50 dark:bg-surface-dark/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-6">
              {t.ourTeam}
            </h2>
            <p className="text-lg text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-2xl mx-auto">
              {t.teamText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky/10 to-sage/10 dark:from-sky/20 dark:to-sage/20 p-8 md:p-12"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground-dark mb-6">
                  {t.forCreators}
                </h2>
                <div className="space-y-4 text-foreground-secondary dark:text-foreground-dark-secondary mb-8">
                  <p>{t.creatorsText1}</p>
                  <p>{t.creatorsText2}</p>
                </div>
                <Link href={`/${lang}/devenir-createur`}>
                  <Button
                    className="font-semibold px-8 py-3 rounded-full"
                    style={{ backgroundColor: '#7A8B6F', color: 'white' }}
                  >
                    {t.creatorsButton}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-apple">
                  <img
                    src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&q=80"
                    alt="Creator at work"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
            style={{ background: 'linear-gradient(to bottom right, #D4A59A, #C9A092)' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white/20">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'white' }}>
                {t.contactTitle}
              </h2>
              <p className="mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {t.contactDesc}
              </p>
              <Link href={`/${lang}/contact`}>
                <Button
                  className="font-semibold px-8 py-3 rounded-full shadow-lg"
                  style={{ backgroundColor: 'white', color: '#B08878' }}
                >
                  {t.contactButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
