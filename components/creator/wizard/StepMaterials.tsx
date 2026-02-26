'use client'

import { useState, useEffect } from 'react'
import { X, Recycle, Sparkles, Link2, Check } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData, MaterielItem } from '../ResourceWizard'
import AutocompleteTag, { TagItem } from './AutocompleteTag'
import { gemPillStyle } from '@/components/filters/gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const translations = {
  fr: {
    title: 'Matériel nécessaire',
    subtitle: 'Indiquez ce dont les parents auront besoin',
    budgetType: 'Type de budget',
    budgetTypeHelp: 'Sélectionnez ce qui correspond le mieux',
    materialsList: 'Liste du matériel',
    materialsListHelp: 'Recherchez ou ajoutez chaque élément nécessaire',
    searchPlaceholder: 'Rechercher un matériau...',
    urlPlaceholder: 'Lien d\'achat (optionnel)',
    addUrl: 'Ajouter lien',
    recup: 'Récup',
    recupHelp: 'Peut être récupéré/recyclé',
    noItems: 'Aucun matériel ajouté',
    customItem: 'Suggestion (sera validée)',
    linkPlaceholder: 'https://lien-affilié...',
    linkHelp: 'Lien d\'achat'
  },
  en: {
    title: 'Required materials',
    subtitle: 'Indicate what parents will need',
    budgetType: 'Budget type',
    budgetTypeHelp: 'Select what fits best',
    materialsList: 'Materials list',
    materialsListHelp: 'Search or add each required item',
    searchPlaceholder: 'Search for a material...',
    urlPlaceholder: 'Purchase link (optional)',
    addUrl: 'Add link',
    recup: 'Recycled',
    recupHelp: 'Can be recovered/recycled',
    noItems: 'No materials added',
    customItem: 'Suggestion (will be reviewed)',
    linkPlaceholder: 'https://affiliate-link...',
    linkHelp: 'Purchase link'
  },
  es: {
    title: 'Material necesario',
    subtitle: 'Indica lo que necesitarán los padres',
    budgetType: 'Tipo de presupuesto',
    budgetTypeHelp: 'Selecciona lo que mejor corresponda',
    materialsList: 'Lista de materiales',
    materialsListHelp: 'Busca o agrega cada elemento necesario',
    searchPlaceholder: 'Buscar un material...',
    urlPlaceholder: 'Enlace de compra (opcional)',
    addUrl: 'Agregar enlace',
    recup: 'Reciclado',
    recupHelp: 'Puede ser recuperado/reciclado',
    noItems: 'Sin materiales agregados',
    customItem: 'Sugerencia (será revisada)',
    linkPlaceholder: 'https://enlace-afiliado...',
    linkHelp: 'Enlace de compra'
  }
}

const budgetOptions = [
  { value: 'sans-materiel', label: { fr: 'Sans matériel', en: 'No materials', es: 'Sin material' }, emoji: '✨' },
  { value: 'maison', label: { fr: 'Matériel maison', en: 'Household items', es: 'Artículos del hogar' }, emoji: '🏠' },
  { value: 'nature', label: { fr: 'Matériel nature', en: 'Natural materials', es: 'Materiales naturales' }, emoji: '🌿' },
  { value: 'petit-budget', label: { fr: 'Petit budget (<10€)', en: 'Budget-friendly (<10€)', es: 'Económico (<10€)' }, emoji: '💰' },
  { value: 'investissement', label: { fr: 'Investissement', en: 'Investment', es: 'Inversión' }, emoji: '🛒' }
]

// Liste prédéfinie de matériaux courants
const predefinedMaterials: TagItem[] = [
  // Papeterie
  { value: 'papier-blanc', label: { fr: 'Papier blanc', en: 'White paper', es: 'Papel blanco' }, emoji: '📄' },
  { value: 'papier-couleur', label: { fr: 'Papier couleur', en: 'Colored paper', es: 'Papel de color' }, emoji: '📄' },
  { value: 'papier-cartonne', label: { fr: 'Papier cartonné', en: 'Cardstock', es: 'Cartulina' }, emoji: '📄' },
  { value: 'carton', label: { fr: 'Carton', en: 'Cardboard', es: 'Cartón' }, emoji: '📦' },
  { value: 'carton-recup', label: { fr: 'Carton de récup', en: 'Recycled cardboard', es: 'Cartón reciclado' }, emoji: '📦' },

  // Colles & adhésifs
  { value: 'colle-baton', label: { fr: 'Colle en bâton', en: 'Glue stick', es: 'Barra de pegamento' }, emoji: '🧴' },
  { value: 'colle-liquide', label: { fr: 'Colle liquide', en: 'Liquid glue', es: 'Pegamento líquido' }, emoji: '🧴' },
  { value: 'colle-chaude', label: { fr: 'Pistolet à colle', en: 'Hot glue gun', es: 'Pistola de silicona' }, emoji: '🔫' },
  { value: 'scotch', label: { fr: 'Scotch / Ruban adhésif', en: 'Tape', es: 'Cinta adhesiva' }, emoji: '📎' },
  { value: 'masking-tape', label: { fr: 'Masking tape', en: 'Masking tape', es: 'Cinta de carrocero' }, emoji: '📎' },

  // Ciseaux & découpe
  { value: 'ciseaux', label: { fr: 'Ciseaux', en: 'Scissors', es: 'Tijeras' }, emoji: '✂️' },
  { value: 'ciseaux-cranteurs', label: { fr: 'Ciseaux cranteurs', en: 'Craft scissors', es: 'Tijeras decorativas' }, emoji: '✂️' },
  { value: 'perforatrice', label: { fr: 'Perforatrice', en: 'Hole punch', es: 'Perforadora' }, emoji: '🕳️' },

  // Écriture & dessin
  { value: 'crayons-couleur', label: { fr: 'Crayons de couleur', en: 'Colored pencils', es: 'Lápices de colores' }, emoji: '✏️' },
  { value: 'crayons-cire', label: { fr: 'Crayons de cire', en: 'Crayons', es: 'Crayones' }, emoji: '🖍️' },
  { value: 'feutres', label: { fr: 'Feutres', en: 'Markers', es: 'Rotuladores' }, emoji: '🖊️' },
  { value: 'feutres-lavables', label: { fr: 'Feutres lavables', en: 'Washable markers', es: 'Rotuladores lavables' }, emoji: '🖊️' },
  { value: 'stylos', label: { fr: 'Stylos', en: 'Pens', es: 'Bolígrafos' }, emoji: '🖊️' },
  { value: 'crayon-papier', label: { fr: 'Crayon à papier', en: 'Pencil', es: 'Lápiz' }, emoji: '✏️' },

  // Peinture
  { value: 'peinture-gouache', label: { fr: 'Peinture gouache', en: 'Gouache paint', es: 'Pintura gouache' }, emoji: '🎨' },
  { value: 'peinture-acrylique', label: { fr: 'Peinture acrylique', en: 'Acrylic paint', es: 'Pintura acrílica' }, emoji: '🎨' },
  { value: 'peinture-doigts', label: { fr: 'Peinture à doigts', en: 'Finger paint', es: 'Pintura de dedos' }, emoji: '🎨' },
  { value: 'aquarelle', label: { fr: 'Aquarelle', en: 'Watercolor', es: 'Acuarela' }, emoji: '🎨' },
  { value: 'pinceaux', label: { fr: 'Pinceaux', en: 'Brushes', es: 'Pinceles' }, emoji: '🖌️' },
  { value: 'palette', label: { fr: 'Palette', en: 'Palette', es: 'Paleta' }, emoji: '🎨' },
  { value: 'tablier', label: { fr: 'Tablier', en: 'Apron', es: 'Delantal' }, emoji: '👕' },

  // Modelage
  { value: 'pate-modeler', label: { fr: 'Pâte à modeler', en: 'Play dough', es: 'Plastilina' }, emoji: '🟤' },
  { value: 'pate-sel', label: { fr: 'Pâte à sel', en: 'Salt dough', es: 'Masa de sal' }, emoji: '🟤' },
  { value: 'argile', label: { fr: 'Argile', en: 'Clay', es: 'Arcilla' }, emoji: '🟤' },
  { value: 'outils-modelage', label: { fr: 'Outils de modelage', en: 'Modeling tools', es: 'Herramientas de modelado' }, emoji: '🔧' },

  // Mercerie & couture
  { value: 'fil-laine', label: { fr: 'Fil / Laine', en: 'Yarn / Thread', es: 'Hilo / Lana' }, emoji: '🧶' },
  { value: 'aiguille-plastique', label: { fr: 'Aiguille plastique', en: 'Plastic needle', es: 'Aguja de plástico' }, emoji: '🪡' },
  { value: 'boutons', label: { fr: 'Boutons', en: 'Buttons', es: 'Botones' }, emoji: '🔘' },
  { value: 'tissus', label: { fr: 'Chutes de tissus', en: 'Fabric scraps', es: 'Retazos de tela' }, emoji: '🧵' },
  { value: 'feutrine', label: { fr: 'Feutrine', en: 'Felt', es: 'Fieltro' }, emoji: '🧵' },
  { value: 'rubans', label: { fr: 'Rubans', en: 'Ribbons', es: 'Cintas' }, emoji: '🎀' },

  // Décoration
  { value: 'paillettes', label: { fr: 'Paillettes', en: 'Glitter', es: 'Purpurina' }, emoji: '✨' },
  { value: 'sequins', label: { fr: 'Sequins', en: 'Sequins', es: 'Lentejuelas' }, emoji: '✨' },
  { value: 'gommettes', label: { fr: 'Gommettes', en: 'Stickers', es: 'Pegatinas' }, emoji: '⭐' },
  { value: 'yeux-mobiles', label: { fr: 'Yeux mobiles', en: 'Googly eyes', es: 'Ojos móviles' }, emoji: '👀' },
  { value: 'pompons', label: { fr: 'Pompons', en: 'Pom poms', es: 'Pompones' }, emoji: '🔴' },
  { value: 'plumes', label: { fr: 'Plumes', en: 'Feathers', es: 'Plumas' }, emoji: '🪶' },
  { value: 'perles', label: { fr: 'Perles', en: 'Beads', es: 'Cuentas' }, emoji: '📿' },
  { value: 'chenilles', label: { fr: 'Fils chenille / Cure-pipes', en: 'Pipe cleaners', es: 'Limpiapipas' }, emoji: '🐛' },

  // Nature
  { value: 'feuilles', label: { fr: 'Feuilles d\'arbres', en: 'Leaves', es: 'Hojas' }, emoji: '🍂' },
  { value: 'fleurs', label: { fr: 'Fleurs / Pétales', en: 'Flowers / Petals', es: 'Flores / Pétalos' }, emoji: '🌸' },
  { value: 'branches', label: { fr: 'Branches / Bâtons', en: 'Sticks / Twigs', es: 'Ramas / Palitos' }, emoji: '🪵' },
  { value: 'pierres', label: { fr: 'Pierres / Galets', en: 'Stones / Pebbles', es: 'Piedras' }, emoji: '🪨' },
  { value: 'coquillages', label: { fr: 'Coquillages', en: 'Shells', es: 'Conchas' }, emoji: '🐚' },
  { value: 'sable', label: { fr: 'Sable', en: 'Sand', es: 'Arena' }, emoji: '🏖️' },
  { value: 'terre', label: { fr: 'Terre', en: 'Soil', es: 'Tierra' }, emoji: '🪴' },
  { value: 'graines', label: { fr: 'Graines', en: 'Seeds', es: 'Semillas' }, emoji: '🌱' },

  // Récupération
  { value: 'rouleaux-carton', label: { fr: 'Rouleaux carton (PQ)', en: 'Toilet paper rolls', es: 'Rollos de cartón' }, emoji: '🧻' },
  { value: 'boite-oeufs', label: { fr: 'Boîte à œufs', en: 'Egg carton', es: 'Caja de huevos' }, emoji: '🥚' },
  { value: 'bouchons', label: { fr: 'Bouchons', en: 'Bottle caps', es: 'Tapones' }, emoji: '🔴' },
  { value: 'bouteilles-plastique', label: { fr: 'Bouteilles plastique', en: 'Plastic bottles', es: 'Botellas de plástico' }, emoji: '🧴' },
  { value: 'pots-yaourt', label: { fr: 'Pots de yaourt', en: 'Yogurt cups', es: 'Vasos de yogur' }, emoji: '🥛' },
  { value: 'boites-conserve', label: { fr: 'Boîtes de conserve', en: 'Tin cans', es: 'Latas' }, emoji: '🥫' },
  { value: 'journaux', label: { fr: 'Journaux / Magazines', en: 'Newspapers / Magazines', es: 'Periódicos / Revistas' }, emoji: '📰' },

  // Cuisine
  { value: 'farine', label: { fr: 'Farine', en: 'Flour', es: 'Harina' }, emoji: '🌾' },
  { value: 'sel', label: { fr: 'Sel', en: 'Salt', es: 'Sal' }, emoji: '🧂' },
  { value: 'eau', label: { fr: 'Eau', en: 'Water', es: 'Agua' }, emoji: '💧' },
  { value: 'huile', label: { fr: 'Huile', en: 'Oil', es: 'Aceite' }, emoji: '🫒' },
  { value: 'colorants-alimentaires', label: { fr: 'Colorants alimentaires', en: 'Food coloring', es: 'Colorantes alimentarios' }, emoji: '🎨' },
  { value: 'vinaigre', label: { fr: 'Vinaigre', en: 'Vinegar', es: 'Vinagre' }, emoji: '🧪' },
  { value: 'bicarbonate', label: { fr: 'Bicarbonate', en: 'Baking soda', es: 'Bicarbonato' }, emoji: '🧪' },

  // Sensoriel
  { value: 'riz', label: { fr: 'Riz', en: 'Rice', es: 'Arroz' }, emoji: '🍚' },
  { value: 'pates-seches', label: { fr: 'Pâtes sèches', en: 'Dry pasta', es: 'Pasta seca' }, emoji: '🍝' },
  { value: 'lentilles', label: { fr: 'Lentilles', en: 'Lentils', es: 'Lentejas' }, emoji: '🫘' },
  { value: 'coton', label: { fr: 'Coton / Ouate', en: 'Cotton', es: 'Algodón' }, emoji: '☁️' },
  { value: 'mousse-raser', label: { fr: 'Mousse à raser', en: 'Shaving cream', es: 'Espuma de afeitar' }, emoji: '🧴' },
  { value: 'gel', label: { fr: 'Gel / Slime', en: 'Gel / Slime', es: 'Gel / Slime' }, emoji: '🟢' },

  // Outils
  { value: 'regle', label: { fr: 'Règle', en: 'Ruler', es: 'Regla' }, emoji: '📏' },
  { value: 'compas', label: { fr: 'Compas', en: 'Compass', es: 'Compás' }, emoji: '📐' },
  { value: 'eponge', label: { fr: 'Éponge', en: 'Sponge', es: 'Esponja' }, emoji: '🧽' },
  { value: 'cure-dents', label: { fr: 'Cure-dents', en: 'Toothpicks', es: 'Palillos' }, emoji: '🪥' },
  { value: 'batons-glace', label: { fr: 'Bâtons de glace', en: 'Popsicle sticks', es: 'Palitos de helado' }, emoji: '🍦' },
  { value: 'pailles', label: { fr: 'Pailles', en: 'Straws', es: 'Pajitas' }, emoji: '🥤' },
  { value: 'ballons', label: { fr: 'Ballons de baudruche', en: 'Balloons', es: 'Globos' }, emoji: '🎈' },

  // Imprimante
  { value: 'imprimante', label: { fr: 'Imprimante', en: 'Printer', es: 'Impresora' }, emoji: '🖨️' },
  { value: 'plastifieuse', label: { fr: 'Plastifieuse', en: 'Laminator', es: 'Plastificadora' }, emoji: '📋' },
]

interface StepMaterialsProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepMaterials({ formData, updateFormData, lang }: StepMaterialsProps) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const BUDGET_GEM = 'amber' as const
  // v2: URL supprimées (liens affiliés gérés via bloc list-links dans le canvas)

  const toggleMaterial = (value: string) => {
    const current = formData.materials
    if (current.includes(value)) {
      updateFormData({ materials: current.filter(m => m !== value) })
    } else {
      updateFormData({ materials: [...current, value] })
    }
  }

  const handleAddMaterial = (value: string, isCustom: boolean) => {
    // Éviter les doublons
    if (formData.materiel_json.some(m => m.item === value)) return

    // v2: Plus de champ URL (géré via bloc list-links dans le canvas)
    const newItem: MaterielItem = {
      item: value,
      recup: false,
      isCustom
    }
    updateFormData({
      materiel_json: [...formData.materiel_json, newItem]
    })
  }

  const handleRemoveMaterial = (value: string) => {
    updateFormData({
      materiel_json: formData.materiel_json.filter(m => m.item !== value)
    })
  }

  const toggleRecup = (index: number) => {
    const updated = [...formData.materiel_json]
    updated[index].recup = !updated[index].recup
    updateFormData({ materiel_json: updated })
  }

  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null)
  const [urlDraft, setUrlDraft] = useState('')

  const toggleUrlEdit = (index: number) => {
    if (editingUrlIndex === index) {
      setEditingUrlIndex(null)
      setUrlDraft('')
    } else {
      setEditingUrlIndex(index)
      setUrlDraft(formData.materiel_json[index].url || '')
    }
  }

  const saveUrl = (index: number) => {
    const updated = [...formData.materiel_json]
    updated[index] = { ...updated[index], url: urlDraft.trim() || undefined }
    updateFormData({ materiel_json: updated })
    setEditingUrlIndex(null)
    setUrlDraft('')
  }

  const getLabel = (item: string): string => {
    const predefined = predefinedMaterials.find(m => m.value === item)
    return predefined ? predefined.label[lang] : item
  }

  const getEmoji = (item: string): string | undefined => {
    const predefined = predefinedMaterials.find(m => m.value === item)
    return predefined?.emoji
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E] dark:text-white">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 dark:text-white/50 mt-1">{t.subtitle}</p>
      </div>

      {/* Budget Type */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.budgetType}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.budgetTypeHelp}</p>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map(opt => {
            const isSelected = formData.materials.includes(opt.value)
            const s = gemPillStyle(BUDGET_GEM, isSelected, isDark)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleMaterial(opt.value)}
                className="transition-all duration-300 active:scale-[0.97]"
                style={s.wrapper}
              >
                <div className="flex items-center gap-1.5" style={{ ...s.inner, padding: '6px 14px', fontSize: 13 }}>
                  {isSelected && <span aria-hidden style={s.frost} />}
                  {isSelected && <span aria-hidden style={s.shine} />}
                  <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={opt.value} size={16} /></span>
                  <span style={{ position: 'relative', zIndex: 2 }}>{opt.label[lang]}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Materials List with Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.materialsList}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.materialsListHelp}</p>

        <AutocompleteTag
          lang={lang}
          predefinedOptions={predefinedMaterials}
          selectedValues={formData.materiel_json.map(m => m.item)}
          onAdd={handleAddMaterial}
          onRemove={handleRemoveMaterial}
          placeholder={t.searchPlaceholder}
          allowCustom={true}
          colorClass="bg-[#F5E6D3]"
          hideTags
        />

        {/* Liste détaillée avec options URL et Récup */}
        {formData.materiel_json.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.materiel_json.map((item, index) => (
              <div key={item.item} className="rounded-xl border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                <div className="flex items-center gap-2 p-3">
                  {/* Emoji + Label */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FilterIcon value={item.item} size={16} />
                    <span className="text-sm font-medium text-[#5D5A4E] dark:text-white truncate">
                      {getLabel(item.item)}
                    </span>
                    {item.isCustom && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                    {item.url && editingUrlIndex !== index && (
                      <span className="text-xs text-[#A8B5A0] dark:text-[#6EE8A0]/60 truncate max-w-[120px]" title={item.url}>
                        <Link2 className="w-3 h-3 inline mr-0.5" />
                        lien
                      </span>
                    )}
                  </div>

                  {/* Lien affilié toggle */}
                  <button
                    type="button"
                    onClick={() => toggleUrlEdit(index)}
                    className={`p-1.5 rounded-lg transition-all ${
                      item.url
                        ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-300'
                        : editingUrlIndex === index
                          ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-300'
                          : 'text-[#5D5A4E]/30 hover:text-blue-500 hover:bg-blue-50 dark:text-white/20 dark:hover:text-blue-300 dark:hover:bg-blue-500/10'
                    }`}
                    title={t.linkHelp}
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  {/* Récup toggle */}
                  <button
                    type="button"
                    onClick={() => toggleRecup(index)}
                    className={`p-1.5 rounded-lg transition-all ${
                      item.recup
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-[#5D5A4E]/30 hover:text-green-500 hover:bg-green-50 dark:text-white/20 dark:hover:bg-green-900/20'
                    }`}
                    title={t.recupHelp}
                  >
                    <Recycle className="w-4 h-4" />
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(item.item)}
                    className="p-1.5 text-[#5D5A4E]/30 hover:text-red-500 hover:bg-red-50 dark:text-white/20 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* URL input row */}
                {editingUrlIndex === index && (
                  <div className="flex items-center gap-2 px-3 pb-3 pt-0">
                    <input
                      type="url"
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveUrl(index) } }}
                      placeholder={t.linkPlaceholder}
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-[#A8B5A0]/30 dark:border-white/10 bg-transparent dark:bg-white/5 focus:border-blue-400 dark:focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 outline-none transition-all dark:text-white dark:placeholder:text-white/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveUrl(index)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {formData.materiel_json.length === 0 && (
          <p className="text-sm text-[#5D5A4E]/50 dark:text-white/40 text-center py-4 mt-4">{t.noItems}</p>
        )}
      </div>
    </div>
  )
}
