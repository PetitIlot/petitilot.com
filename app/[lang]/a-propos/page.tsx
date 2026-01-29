'use client'

import { useState, useEffect } from 'react'
import { Heart, Tv, CakeSlice, Users } from 'lucide-react'
import { Language } from '@/lib/types'
import { motion } from 'framer-motion'

const translations = {
  fr: {
    title: 'À propos de Petit Îlot',
    ourStory: 'Notre histoire',
    storyText1: "Notre aventure a commencé quand nous avons réalisé que les moments les plus précieux avec nos enfants n'avaient pas besoin d'écrans ou de jouets coûteux. Un bac d'eau, de la peinture, une balade en forêt... c'est souvent tout ce qu'il faut pour créer des souvenirs inoubliables.",
    storyText2: "Petit Îlot, c'est notre façon de partager ces découvertes avec vous. Des activités simples, testées et approuvées par nos petits, pour que chaque famille puisse créer son propre petit îlot de bonheur.",
    ourValues: 'Nos valeurs',
    valueLowQuantity: 'Slow parenting',
    valueLowQuantityDesc: 'Prendre le temps, ralentir, observer et accompagner nos enfants à leur rythme.',
    valueNoScreen: 'Sans écran',
    valueNoScreenDesc: 'Des activités pour développer la créativité et l\'imagination sans dépendre des écrans.',
    valueNoSugar: 'Sans sucre ajouté',
    valueNoSugarDesc: 'Des recettes saines et gourmandes pour développer le goût de vraies saveurs.',
    valueAuthenticity: 'Authenticité',
    valueAuthenticityDesc: 'Du contenu créé par des parents pour des parents, sans filtre ni artifice.'
  },
  en: {
    title: 'About Petit Îlot',
    ourStory: 'Our story',
    storyText1: "Our adventure began when we realized that the most precious moments with our children didn't need screens or expensive toys. A tub of water, some paint, a walk in the forest... that's often all it takes to create unforgettable memories.",
    storyText2: "Petit Îlot is our way of sharing these discoveries with you. Simple activities, tested and approved by our little ones, so every family can create their own little island of happiness.",
    ourValues: 'Our values',
    valueLowQuantity: 'Slow parenting',
    valueLowQuantityDesc: 'Taking time, slowing down, observing and supporting our children at their own pace.',
    valueNoScreen: 'Screen-free',
    valueNoScreenDesc: 'Activities to develop creativity and imagination without relying on screens.',
    valueNoSugar: 'No added sugar',
    valueNoSugarDesc: 'Healthy and tasty recipes to develop a taste for real flavors.',
    valueAuthenticity: 'Authenticity',
    valueAuthenticityDesc: 'Content created by parents for parents, without filters or artifice.'
  },
  es: {
    title: 'Acerca de Petit Îlot',
    ourStory: 'Nuestra historia',
    storyText1: 'Nuestra aventura comenzó cuando nos dimos cuenta de que los momentos más preciados con nuestros hijos no necesitaban pantallas ni juguetes caros. Un recipiente de agua, pintura, un paseo por el bosque... a menudo eso es todo lo que se necesita para crear recuerdos inolvidables.',
    storyText2: 'Petit Îlot es nuestra forma de compartir estos descubrimientos contigo. Actividades simples, probadas y aprobadas por nuestros pequeños, para que cada familia pueda crear su propia pequeña isla de felicidad.',
    ourValues: 'Nuestros valores',
    valueLowQuantity: 'Crianza lenta',
    valueLowQuantityDesc: 'Tomarse el tiempo, ir despacio, observar y acompañar a nuestros hijos a su ritmo.',
    valueNoScreen: 'Sin pantallas',
    valueNoScreenDesc: 'Actividades para desarrollar la creatividad y la imaginación sin depender de las pantallas.',
    valueNoSugar: 'Sin azúcar añadido',
    valueNoSugarDesc: 'Recetas saludables y sabrosas para desarrollar el gusto por los sabores reales.',
    valueAuthenticity: 'Autenticidad',
    valueAuthenticityDesc: 'Contenido creado por padres para padres, sin filtros ni artificios.'
  }
}

const values = [
  { key: 'valueLowQuantity', icon: Heart, color: 'bg-[#A8B5A0]' },
  { key: 'valueNoScreen', icon: Tv, color: 'bg-[#C8D8E4]' },
  { key: 'valueNoSugar', icon: CakeSlice, color: 'bg-[#D4A59A]' },
  { key: 'valueAuthenticity', icon: Users, color: 'bg-[#5D5A4E]' }
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-[#F5E6D3]">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-quicksand text-4xl md:text-5xl font-bold text-[#5D5A4E] mb-6"
          >
            {t.title}
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-[#A8B5A0]/20">
                <img
                  src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80"
                  alt="Notre famille"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#A8B5A0] rounded-full -z-10" />
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#C8D8E4] rounded-full -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-quicksand text-3xl font-bold text-[#5D5A4E] mb-6">
                {t.ourStory}
              </h2>
              <div className="space-y-4 text-[#5D5A4E]/80 leading-relaxed">
                <p>{t.storyText1}</p>
                <p>{t.storyText2}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-[#F5E6D3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-quicksand text-3xl md:text-4xl font-bold text-[#5D5A4E] text-center mb-12"
          >
            {t.ourValues}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-quicksand text-xl font-bold text-[#5D5A4E] mb-2">
                    {t[value.key as keyof typeof t]}
                  </h3>
                  <p className="text-[#5D5A4E]/70 leading-relaxed">
                    {t[`${value.key}Desc` as keyof typeof t]}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
