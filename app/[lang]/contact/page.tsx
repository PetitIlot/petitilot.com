'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Send, Check, ChevronDown, Users, Handshake, ArrowRight, Sparkles, Upload, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Language } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

const translations = {
  fr: {
    // Header
    title: 'Contactez-nous',
    subtitle: 'Choisissez la section qui correspond à votre demande',

    // Client section
    clientTitle: 'Clients',
    clientSubtitle: 'Questions, suggestions ou besoin d\'aide ?',
    yourName: 'Votre nom',
    yourEmail: 'Votre email',
    yourMessage: 'Votre message',
    send: 'Envoyer',
    thankYou: 'Merci pour votre message ! Nous vous répondrons sous 48h.',
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: 'Comment télécharger mes ressources ?', a: 'Après achat, rendez-vous dans votre profil > Mes achats. Vos fichiers sont disponibles immédiatement et sans limite de temps.' },
      { q: 'Puis-je obtenir un remboursement ?', a: 'Les ressources numériques ne sont pas remboursables, mais contactez-nous en cas de problème technique.' },
      { q: 'Comment fonctionne le système de crédits ?', a: 'Les crédits vous permettent d\'acheter des ressources sans repasser par Stripe à chaque fois. 1 crédit = 1$.' },
    ],

    // Creator section
    creatorTitle: 'Créateurs',
    creatorSubtitle: 'Rejoignez notre communauté de créateurs passionnés',
    creatorIntro: 'Petit Ilot est une marketplace dédiée aux ressources éducatives pour les 0-6 ans. Nous cherchons des créateurs alignés avec notre philosophie : nature, DIY, et apprentissage sans écran.',
    creatorAdvantages: [
      { icon: 'sparkles', title: '90% de commission', desc: 'Vous gardez la majorité de vos ventes' },
      { icon: 'upload', title: 'Publication simple', desc: 'Interface intuitive pour gérer vos ressources' },
      { icon: 'dollar', title: 'Paiements mensuels', desc: 'Via Stripe Connect, directement sur votre compte' },
    ],
    creatorSteps: [
      'Remplissez le formulaire de candidature',
      'Notre équipe étudie votre profil sous 7 jours',
      'Si accepté, créez votre boutique et publiez',
    ],
    creatorCta: 'Devenir créateur',
    creatorEmail: 'Questions ? Écrivez-nous :',

    // Partner section
    partnerTitle: 'Partenaires',
    partnerSubtitle: 'Marques, éditeurs & collaborations',
    partnerIntro: 'Vous êtes une marque ou un éditeur aligné avec nos valeurs ? Nous sommes ouverts aux collaborations : tests produits, contenus sponsorisés, bundles exclusifs, ou affiliations.',
    partnerCta: 'Discutons de votre projet',
    partnerBrandsTitle: 'Ils nous font confiance',
    partnerBrandsSoon: 'Bientôt...',
  },
  en: {
    title: 'Contact us',
    subtitle: 'Choose the section that matches your request',

    clientTitle: 'Customers',
    clientSubtitle: 'Questions, suggestions or need help?',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourMessage: 'Your message',
    send: 'Send',
    thankYou: 'Thank you for your message! We\'ll get back to you within 48h.',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'How do I download my resources?', a: 'After purchase, go to your profile > My purchases. Your files are available immediately and without time limit.' },
      { q: 'Can I get a refund?', a: 'Digital resources are non-refundable, but contact us in case of technical issues.' },
      { q: 'How does the credit system work?', a: 'Credits allow you to buy resources without going through Stripe each time. 1 credit = $1.' },
    ],

    creatorTitle: 'Creators',
    creatorSubtitle: 'Join our community of passionate creators',
    creatorIntro: 'Petit Ilot is a marketplace dedicated to educational resources for ages 0-6. We\'re looking for creators aligned with our philosophy: nature, DIY, and screen-free learning.',
    creatorAdvantages: [
      { icon: 'sparkles', title: '90% commission', desc: 'You keep most of your sales' },
      { icon: 'upload', title: 'Easy publishing', desc: 'Intuitive interface to manage your resources' },
      { icon: 'dollar', title: 'Monthly payments', desc: 'Via Stripe Connect, directly to your account' },
    ],
    creatorSteps: [
      'Fill out the application form',
      'Our team reviews your profile within 7 days',
      'If accepted, create your shop and publish',
    ],
    creatorCta: 'Become a creator',
    creatorEmail: 'Questions? Write to us:',

    partnerTitle: 'Partners',
    partnerSubtitle: 'Brands, publishers & collaborations',
    partnerIntro: 'Are you a brand or publisher aligned with our values? We\'re open to collaborations: product tests, sponsored content, exclusive bundles, or affiliations.',
    partnerCta: 'Let\'s discuss your project',
    partnerBrandsTitle: 'They trust us',
    partnerBrandsSoon: 'Coming soon...',
  },
  es: {
    title: 'Contáctenos',
    subtitle: 'Elija la sección que corresponde a su solicitud',

    clientTitle: 'Clientes',
    clientSubtitle: '¿Preguntas, sugerencias o necesita ayuda?',
    yourName: 'Su nombre',
    yourEmail: 'Su email',
    yourMessage: 'Su mensaje',
    send: 'Enviar',
    thankYou: '¡Gracias por su mensaje! Le responderemos en 48h.',
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Cómo descargo mis recursos?', a: 'Después de la compra, vaya a su perfil > Mis compras. Sus archivos están disponibles inmediatamente y sin límite de tiempo.' },
      { q: '¿Puedo obtener un reembolso?', a: 'Los recursos digitales no son reembolsables, pero contáctenos en caso de problemas técnicos.' },
      { q: '¿Cómo funciona el sistema de créditos?', a: 'Los créditos le permiten comprar recursos sin pasar por Stripe cada vez. 1 crédito = $1.' },
    ],

    creatorTitle: 'Creadores',
    creatorSubtitle: 'Únase a nuestra comunidad de creadores apasionados',
    creatorIntro: 'Petit Ilot es un marketplace dedicado a recursos educativos para 0-6 años. Buscamos creadores alineados con nuestra filosofía: naturaleza, DIY y aprendizaje sin pantallas.',
    creatorAdvantages: [
      { icon: 'sparkles', title: '90% de comisión', desc: 'Usted conserva la mayoría de sus ventas' },
      { icon: 'upload', title: 'Publicación fácil', desc: 'Interfaz intuitiva para gestionar sus recursos' },
      { icon: 'dollar', title: 'Pagos mensuales', desc: 'Via Stripe Connect, directamente a su cuenta' },
    ],
    creatorSteps: [
      'Complete el formulario de solicitud',
      'Nuestro equipo revisa su perfil en 7 días',
      'Si es aceptado, cree su tienda y publique',
    ],
    creatorCta: 'Ser creador',
    creatorEmail: '¿Preguntas? Escríbanos:',

    partnerTitle: 'Socios',
    partnerSubtitle: 'Marcas, editores y colaboraciones',
    partnerIntro: '¿Es usted una marca o editor alineado con nuestros valores? Estamos abiertos a colaboraciones: pruebas de productos, contenido patrocinado, bundles exclusivos o afiliaciones.',
    partnerCta: 'Hablemos de su proyecto',
    partnerBrandsTitle: 'Confían en nosotros',
    partnerBrandsSoon: 'Próximamente...',
  }
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }} className="last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-foreground dark:text-foreground-dark text-sm">{question}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-secondary dark:text-foreground-dark-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const advantageIcons: Record<string, React.ReactNode> = {
    sparkles: <Sparkles className="w-5 h-5" style={{ color: 'var(--icon-terracotta)' }} />,
    upload: <Upload className="w-5 h-5" style={{ color: 'var(--icon-sky)' }} />,
    dollar: <DollarSign className="w-5 h-5" style={{ color: 'var(--icon-sage)' }} />,
  }

  return (
    <div className="min-h-screen py-16 md:py-24 bg-background dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-quicksand text-4xl md:text-5xl font-bold text-foreground dark:text-foreground-dark mb-4">
            {t.title}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* ========== SECTION 1: CLIENTS ========== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sage/20 dark:bg-sage/30 flex items-center justify-center">
                <Mail className="w-5 h-5" style={{ color: 'var(--icon-sage)' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">{t.clientTitle}</h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">{t.clientSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                {sent ? (
                  <div className="bg-sage/10 dark:bg-sage/20 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center" style={{ border: '1px solid var(--border)' }}>
                    <div className="w-16 h-16 rounded-full bg-sage/20 dark:bg-sage/30 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8" style={{ color: 'var(--icon-sage)' }} />
                    </div>
                    <p className="text-foreground dark:text-foreground-dark font-medium">{t.thankYou}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple space-y-4" style={{ border: '1px solid var(--border)' }}>
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.yourName}</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-sage/30"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.yourEmail}</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-sage/30"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.yourMessage}</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={4}
                        className="bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark resize-none focus:ring-2 focus:ring-sage/30"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sage hover:bg-sage-light text-white h-11 font-semibold"
                    >
                      {loading ? '...' : t.send}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-center text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                      hello@petitilot.ca
                    </p>
                  </form>
                )}
              </div>

              {/* FAQ */}
              <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-4">{t.faqTitle}</h3>
                <div>
                  {t.faq.map((item, i) => (
                    <FAQItem key={i} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ========== SECTION 2: CRÉATEURS ========== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">{t.creatorTitle}</h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">{t.creatorSubtitle}</p>
              </div>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-8">{t.creatorIntro}</p>

              {/* Avantages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {t.creatorAdvantages.map((adv, i) => (
                  <div key={i} className="bg-terracotta/10 dark:bg-terracotta/20 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-terracotta/20 dark:bg-terracotta/30 flex items-center justify-center mb-3">
                      {advantageIcons[adv.icon]}
                    </div>
                    <h4 className="font-semibold text-foreground dark:text-foreground-dark mb-1">{adv.title}</h4>
                    <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{adv.desc}</p>
                  </div>
                ))}
              </div>

              {/* Étapes */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                {t.creatorSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-foreground dark:text-foreground-dark">{step}</span>
                    {i < t.creatorSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-foreground-secondary/30 dark:text-foreground-dark-secondary/30 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href={`/${lang}/devenir-createur`}
                  className="inline-flex items-center gap-2 font-semibold text-white bg-terracotta hover:bg-terracotta/90 px-6 py-3 rounded-full transition-colors"
                >
                  {t.creatorCta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                  {t.creatorEmail}{' '}
                  <a href="mailto:creators@petitilot.ca" className="text-terracotta hover:underline">
                    creators@petitilot.ca
                  </a>
                </span>
              </div>
            </div>
          </motion.section>

          {/* ========== SECTION 3: PARTENAIRES ========== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground dark:bg-foreground-dark flex items-center justify-center">
                <Handshake className="w-5 h-5 text-surface dark:text-surface-dark" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">{t.partnerTitle}</h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">{t.partnerSubtitle}</p>
              </div>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">{t.partnerIntro}</p>

              <a
                href="mailto:partnership@petitilot.ca"
                className="inline-flex items-center gap-2 font-semibold text-surface dark:text-surface-dark bg-foreground dark:bg-foreground-dark hover:opacity-90 px-6 py-3 rounded-full transition-colors mb-8"
              >
                {t.partnerCta}
                <Mail className="w-4 h-4" />
              </a>

              {/* Marques partenaires - placeholder */}
              <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <h4 className="text-sm font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.partnerBrandsTitle}</h4>
                <p className="text-sm text-foreground-secondary/50 dark:text-foreground-dark-secondary/50 italic">{t.partnerBrandsSoon}</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
