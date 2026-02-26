'use client'

import { useState, useEffect } from 'react'
import { X, Recycle, Sparkles, Link2, Check, Info } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData, MaterielItem } from '../ResourceWizard'
import AutocompleteTag, { TagItem } from './AutocompleteTag'
import { GEMS } from '@/components/ui/button'
import { hexToRgb, gemPillStyle } from '@/components/filters/gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const translations = {
  fr: {
    title: 'Métadonnées',
    subtitle: 'Informations complémentaires pour aider les familles',
    // Pédagogie
    pedagogy: 'Informations pédagogiques',
    ageRange: 'Tranche d\'âge',
    ageFrom: 'De', ageTo: 'à', years: 'ans',
    duration: 'Durée de l\'activité',
    durationPrep: 'Temps de préparation',
    minutes: 'minutes',
    intensity: 'Intensité',
    intensityLeger: 'Léger', intensityMoyen: 'Moyen', intensityIntense: 'Intense',
    intensityLegerDesc: 'Activité calme, peu de mouvement',
    intensityMoyenDesc: 'Activité modérée, quelques mouvements',
    intensityIntenseDesc: 'Activité physique, beaucoup de mouvement',
    difficulty: 'Niveau de difficulté',
    easy: 'Facile', easyDesc: 'Première découverte du thème/compétence',
    medium: 'Moyen', mediumDesc: 'Thème/compétence déjà familier',
    hard: 'Difficile', hardDesc: 'Thème/compétence préféré, maîtrisé',
    autonomy: 'Autonomie possible',
    autonomyDesc: 'L\'enfant peut réaliser l\'activité seul après démonstration',
    // Tags
    themes: 'Thèmes',
    themesHelp: 'Recherchez ou ajoutez les thèmes abordés',
    themesPlaceholder: 'Rechercher un thème...',
    competences: 'Compétences développées',
    competencesHelp: 'Recherchez ou ajoutez les compétences travaillées',
    competencesPlaceholder: 'Rechercher une compétence...',
    // Matériel
    materials: 'Matériel nécessaire',
    budgetType: 'Type de budget',
    budgetTypeHelp: 'Sélectionnez ce qui correspond le mieux',
    materialsList: 'Liste du matériel',
    materialsListHelp: 'Recherchez ou ajoutez chaque élément nécessaire',
    searchPlaceholder: 'Rechercher un matériau...',
    recupHelp: 'Peut être récupéré/recyclé',
    noItems: 'Aucun matériel ajouté',
    linkHelp: 'Lien d\'achat',
    linkPlaceholder: 'https://...',
  },
  en: {
    title: 'Metadata',
    subtitle: 'Additional information to help families',
    pedagogy: 'Pedagogical information',
    ageRange: 'Age range',
    ageFrom: 'From', ageTo: 'to', years: 'years',
    duration: 'Activity duration',
    durationPrep: 'Preparation time',
    minutes: 'minutes',
    intensity: 'Intensity',
    intensityLeger: 'Light', intensityMoyen: 'Moderate', intensityIntense: 'Intense',
    intensityLegerDesc: 'Calm activity, little movement',
    intensityMoyenDesc: 'Moderate activity, some movement',
    intensityIntenseDesc: 'Physical activity, lots of movement',
    difficulty: 'Difficulty level',
    easy: 'Easy', easyDesc: 'First discovery of the theme/skill',
    medium: 'Medium', mediumDesc: 'Theme/skill already familiar',
    hard: 'Hard', hardDesc: 'Favorite theme/skill, mastered',
    autonomy: 'Can be done autonomously',
    autonomyDesc: 'Child can do the activity alone after demonstration',
    themes: 'Themes',
    themesHelp: 'Search or add the themes covered',
    themesPlaceholder: 'Search for a theme...',
    competences: 'Skills developed',
    competencesHelp: 'Search or add the skills worked on',
    competencesPlaceholder: 'Search for a skill...',
    materials: 'Required materials',
    budgetType: 'Budget type',
    budgetTypeHelp: 'Select what fits best',
    materialsList: 'Materials list',
    materialsListHelp: 'Search or add each required item',
    searchPlaceholder: 'Search for a material...',
    recupHelp: 'Can be recovered/recycled',
    noItems: 'No materials added',
    linkHelp: 'Purchase link',
    linkPlaceholder: 'https://...',
  },
  es: {
    title: 'Metadatos',
    subtitle: 'Información adicional para ayudar a las familias',
    pedagogy: 'Información pedagógica',
    ageRange: 'Rango de edad',
    ageFrom: 'De', ageTo: 'a', years: 'años',
    duration: 'Duración de la actividad',
    durationPrep: 'Tiempo de preparación',
    minutes: 'minutos',
    intensity: 'Intensidad',
    intensityLeger: 'Ligera', intensityMoyen: 'Moderada', intensityIntense: 'Intensa',
    intensityLegerDesc: 'Actividad tranquila, poco movimiento',
    intensityMoyenDesc: 'Actividad moderada, algo de movimiento',
    intensityIntenseDesc: 'Actividad física, mucho movimiento',
    difficulty: 'Nivel de dificultad',
    easy: 'Fácil', easyDesc: 'Primer descubrimiento del tema/habilidad',
    medium: 'Medio', mediumDesc: 'Tema/habilidad ya familiar',
    hard: 'Difícil', hardDesc: 'Tema/habilidad favorito, dominado',
    autonomy: 'Puede hacerse de forma autónoma',
    autonomyDesc: 'El niño puede hacer la actividad solo después de una demostración',
    themes: 'Temas',
    themesHelp: 'Busca o agrega los temas abordados',
    themesPlaceholder: 'Buscar un tema...',
    competences: 'Competencias desarrolladas',
    competencesHelp: 'Busca o agrega las competencias trabajadas',
    competencesPlaceholder: 'Buscar una competencia...',
    materials: 'Material necesario',
    budgetType: 'Tipo de presupuesto',
    budgetTypeHelp: 'Selecciona lo que mejor corresponda',
    materialsList: 'Lista de materiales',
    materialsListHelp: 'Busca o agrega cada elemento necesario',
    searchPlaceholder: 'Buscar un material...',
    recupHelp: 'Puede ser recuperado/reciclado',
    noItems: 'Sin materiales agregados',
    linkHelp: 'Enlace de compra',
    linkPlaceholder: 'https://...',
  },
}

const ageOptions = [0, 1, 2, 3, 4, 5, 6].map(v => ({ value: v, label: String(v) }))

const predefinedThemes: TagItem[] = [
  { value: 'Printemps', label: { fr: 'Printemps', en: 'Spring', es: 'Primavera' }, emoji: '🌸' },
  { value: 'Été', label: { fr: 'Été', en: 'Summer', es: 'Verano' }, emoji: '☀️' },
  { value: 'Automne', label: { fr: 'Automne', en: 'Fall', es: 'Otoño' }, emoji: '🍂' },
  { value: 'Hiver', label: { fr: 'Hiver', en: 'Winter', es: 'Invierno' }, emoji: '❄️' },
  { value: 'Noël', label: { fr: 'Noël', en: 'Christmas', es: 'Navidad' }, emoji: '🎄' },
  { value: 'Pâques', label: { fr: 'Pâques', en: 'Easter', es: 'Pascua' }, emoji: '🐰' },
  { value: 'Halloween', label: { fr: 'Halloween', en: 'Halloween', es: 'Halloween' }, emoji: '🎃' },
  { value: 'Saint-Valentin', label: { fr: 'Saint-Valentin', en: "Valentine's Day", es: 'San Valentín' }, emoji: '💕' },
  { value: 'Fête des mères', label: { fr: 'Fête des mères', en: "Mother's Day", es: 'Día de la madre' }, emoji: '💐' },
  { value: 'Fête des pères', label: { fr: 'Fête des pères', en: "Father's Day", es: 'Día del padre' }, emoji: '👔' },
  { value: 'Carnaval', label: { fr: 'Carnaval', en: 'Carnival', es: 'Carnaval' }, emoji: '🎭' },
  { value: 'Nature', label: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' }, emoji: '🌳' },
  { value: 'Animaux', label: { fr: 'Animaux', en: 'Animals', es: 'Animales' }, emoji: '🐾' },
  { value: 'Océan & mer', label: { fr: 'Océan & mer', en: 'Ocean & sea', es: 'Océano y mar' }, emoji: '🌊' },
  { value: 'Jardin & plantes', label: { fr: 'Jardin & plantes', en: 'Garden & plants', es: 'Jardín y plantas' }, emoji: '🌱' },
  { value: 'Forêt', label: { fr: 'Forêt', en: 'Forest', es: 'Bosque' }, emoji: '🌲' },
  { value: 'Météo', label: { fr: 'Météo', en: 'Weather', es: 'Clima' }, emoji: '🌈' },
  { value: 'Espace', label: { fr: 'Espace', en: 'Space', es: 'Espacio' }, emoji: '🚀' },
  { value: 'Maison', label: { fr: 'Maison', en: 'Home', es: 'Casa' }, emoji: '🏠' },
  { value: 'Famille', label: { fr: 'Famille', en: 'Family', es: 'Familia' }, emoji: '👨‍👩‍👧' },
  { value: 'École', label: { fr: 'École', en: 'School', es: 'Escuela' }, emoji: '🏫' },
  { value: 'Transports', label: { fr: 'Transports', en: 'Transportation', es: 'Transporte' }, emoji: '🚗' },
  { value: 'Alimentation', label: { fr: 'Alimentation', en: 'Food', es: 'Alimentación' }, emoji: '🍎' },
  { value: 'Corps humain', label: { fr: 'Corps humain', en: 'Human body', es: 'Cuerpo humano' }, emoji: '🫀' },
  { value: 'Contes & Histoires', label: { fr: 'Contes & Histoires', en: 'Stories', es: 'Cuentos' }, emoji: '📚' },
  { value: 'Dinosaures', label: { fr: 'Dinosaures', en: 'Dinosaurs', es: 'Dinosaurios' }, emoji: '🦕' },
  { value: 'Pirates', label: { fr: 'Pirates', en: 'Pirates', es: 'Piratas' }, emoji: '🏴‍☠️' },
  { value: 'Princesses', label: { fr: 'Princesses', en: 'Princesses', es: 'Princesas' }, emoji: '👸' },
  { value: 'Super-héros', label: { fr: 'Super-héros', en: 'Superheroes', es: 'Superhéroes' }, emoji: '🦸' },
  { value: 'Musique', label: { fr: 'Musique', en: 'Music', es: 'Música' }, emoji: '🎵' },
  { value: 'Couleurs', label: { fr: 'Couleurs', en: 'Colors', es: 'Colores' }, emoji: '🎨' },
  { value: 'Formes', label: { fr: 'Formes', en: 'Shapes', es: 'Formas' }, emoji: '🔷' },
  { value: 'Chiffres', label: { fr: 'Chiffres', en: 'Numbers', es: 'Números' }, emoji: '🔢' },
  { value: 'Lettres', label: { fr: 'Lettres', en: 'Letters', es: 'Letras' }, emoji: '🔤' },
]

const predefinedCompetences: TagItem[] = [
  { value: 'Motricité fine', label: { fr: 'Motricité fine', en: 'Fine motor skills', es: 'Motricidad fina' }, emoji: '✋' },
  { value: 'Motricité globale', label: { fr: 'Motricité globale', en: 'Gross motor skills', es: 'Motricidad gruesa' }, emoji: '🤸' },
  { value: 'Coordination', label: { fr: 'Coordination', en: 'Coordination', es: 'Coordinación' }, emoji: '🎯' },
  { value: 'Équilibre', label: { fr: 'Équilibre', en: 'Balance', es: 'Equilibrio' }, emoji: '⚖️' },
  { value: 'Logique & Maths', label: { fr: 'Logique & Maths', en: 'Logic & Math', es: 'Lógica y Matemáticas' }, emoji: '🔢' },
  { value: 'Mémoire', label: { fr: 'Mémoire', en: 'Memory', es: 'Memoria' }, emoji: '🧠' },
  { value: 'Concentration', label: { fr: 'Concentration', en: 'Focus', es: 'Concentración' }, emoji: '🎯' },
  { value: 'Résolution de problèmes', label: { fr: 'Résolution de problèmes', en: 'Problem solving', es: 'Resolución de problemas' }, emoji: '💡' },
  { value: 'Observation', label: { fr: 'Observation', en: 'Observation', es: 'Observación' }, emoji: '👁️' },
  { value: 'Tri & classement', label: { fr: 'Tri & classement', en: 'Sorting & classifying', es: 'Clasificación' }, emoji: '📊' },
  { value: 'Langage', label: { fr: 'Langage', en: 'Language', es: 'Lenguaje' }, emoji: '💬' },
  { value: 'Vocabulaire', label: { fr: 'Vocabulaire', en: 'Vocabulary', es: 'Vocabulario' }, emoji: '📖' },
  { value: 'Pré-lecture', label: { fr: 'Pré-lecture', en: 'Pre-reading', es: 'Pre-lectura' }, emoji: '📚' },
  { value: 'Pré-écriture', label: { fr: 'Pré-écriture', en: 'Pre-writing', es: 'Pre-escritura' }, emoji: '✏️' },
  { value: 'Créativité', label: { fr: 'Créativité', en: 'Creativity', es: 'Creatividad' }, emoji: '💡' },
  { value: 'Imagination', label: { fr: 'Imagination', en: 'Imagination', es: 'Imaginación' }, emoji: '🌈' },
  { value: 'Expression artistique', label: { fr: 'Expression artistique', en: 'Artistic expression', es: 'Expresión artística' }, emoji: '🎨' },
  { value: 'Gestion des émotions', label: { fr: 'Gestion des émotions', en: 'Emotional regulation', es: 'Gestión emocional' }, emoji: '💚' },
  { value: 'Socialisation', label: { fr: 'Socialisation', en: 'Social skills', es: 'Socialización' }, emoji: '👥' },
  { value: 'Coopération', label: { fr: 'Coopération', en: 'Cooperation', es: 'Cooperación' }, emoji: '🤝' },
  { value: 'Patience', label: { fr: 'Patience', en: 'Patience', es: 'Paciencia' }, emoji: '⏳' },
  { value: 'Confiance en soi', label: { fr: 'Confiance en soi', en: 'Self-confidence', es: 'Confianza en sí mismo' }, emoji: '⭐' },
  { value: 'Autonomie', label: { fr: 'Autonomie', en: 'Independence', es: 'Autonomía' }, emoji: '🌟' },
  { value: 'Vie pratique', label: { fr: 'Vie pratique', en: 'Practical life', es: 'Vida práctica' }, emoji: '🧹' },
  { value: 'Découverte sensorielle', label: { fr: 'Découverte sensorielle', en: 'Sensory discovery', es: 'Descubrimiento sensorial' }, emoji: '👀' },
  { value: 'Éveil musical', label: { fr: 'Éveil musical', en: 'Musical awakening', es: 'Despertar musical' }, emoji: '🎶' },
]

const budgetOptions = [
  { value: 'sans-materiel', label: { fr: 'Sans matériel', en: 'No materials', es: 'Sin material' } },
  { value: 'maison', label: { fr: 'Matériel maison', en: 'Household items', es: 'Artículos del hogar' } },
  { value: 'nature', label: { fr: 'Matériel nature', en: 'Natural materials', es: 'Materiales naturales' } },
  { value: 'petit-budget', label: { fr: 'Petit budget (<10€)', en: 'Budget-friendly (<10€)', es: 'Económico (<10€)' } },
  { value: 'investissement', label: { fr: 'Investissement', en: 'Investment', es: 'Inversión' } },
]

const predefinedMaterials: TagItem[] = [
  { value: 'papier-blanc', label: { fr: 'Papier blanc', en: 'White paper', es: 'Papel blanco' }, emoji: '📄' },
  { value: 'papier-couleur', label: { fr: 'Papier couleur', en: 'Colored paper', es: 'Papel de color' }, emoji: '📄' },
  { value: 'papier-cartonne', label: { fr: 'Papier cartonné', en: 'Cardstock', es: 'Cartulina' }, emoji: '📄' },
  { value: 'carton', label: { fr: 'Carton', en: 'Cardboard', es: 'Cartón' }, emoji: '📦' },
  { value: 'carton-recup', label: { fr: 'Carton de récup', en: 'Recycled cardboard', es: 'Cartón reciclado' }, emoji: '📦' },
  { value: 'colle-baton', label: { fr: 'Colle en bâton', en: 'Glue stick', es: 'Barra de pegamento' }, emoji: '🧴' },
  { value: 'colle-liquide', label: { fr: 'Colle liquide', en: 'Liquid glue', es: 'Pegamento líquido' }, emoji: '🧴' },
  { value: 'colle-chaude', label: { fr: 'Pistolet à colle', en: 'Hot glue gun', es: 'Pistola de silicona' }, emoji: '🔫' },
  { value: 'scotch', label: { fr: 'Scotch / Ruban adhésif', en: 'Tape', es: 'Cinta adhesiva' }, emoji: '📎' },
  { value: 'masking-tape', label: { fr: 'Masking tape', en: 'Masking tape', es: 'Cinta de carrocero' }, emoji: '📎' },
  { value: 'ciseaux', label: { fr: 'Ciseaux', en: 'Scissors', es: 'Tijeras' }, emoji: '✂️' },
  { value: 'ciseaux-cranteurs', label: { fr: 'Ciseaux cranteurs', en: 'Craft scissors', es: 'Tijeras decorativas' }, emoji: '✂️' },
  { value: 'perforatrice', label: { fr: 'Perforatrice', en: 'Hole punch', es: 'Perforadora' }, emoji: '🕳️' },
  { value: 'crayons-couleur', label: { fr: 'Crayons de couleur', en: 'Colored pencils', es: 'Lápices de colores' }, emoji: '✏️' },
  { value: 'crayons-cire', label: { fr: 'Crayons de cire', en: 'Crayons', es: 'Crayones' }, emoji: '🖍️' },
  { value: 'feutres', label: { fr: 'Feutres', en: 'Markers', es: 'Rotuladores' }, emoji: '🖊️' },
  { value: 'feutres-lavables', label: { fr: 'Feutres lavables', en: 'Washable markers', es: 'Rotuladores lavables' }, emoji: '🖊️' },
  { value: 'stylos', label: { fr: 'Stylos', en: 'Pens', es: 'Bolígrafos' }, emoji: '🖊️' },
  { value: 'crayon-papier', label: { fr: 'Crayon à papier', en: 'Pencil', es: 'Lápiz' }, emoji: '✏️' },
  { value: 'peinture-gouache', label: { fr: 'Peinture gouache', en: 'Gouache paint', es: 'Pintura gouache' }, emoji: '🎨' },
  { value: 'peinture-acrylique', label: { fr: 'Peinture acrylique', en: 'Acrylic paint', es: 'Pintura acrílica' }, emoji: '🎨' },
  { value: 'peinture-doigts', label: { fr: 'Peinture à doigts', en: 'Finger paint', es: 'Pintura de dedos' }, emoji: '🎨' },
  { value: 'aquarelle', label: { fr: 'Aquarelle', en: 'Watercolor', es: 'Acuarela' }, emoji: '🎨' },
  { value: 'pinceaux', label: { fr: 'Pinceaux', en: 'Brushes', es: 'Pinceles' }, emoji: '🖌️' },
  { value: 'pate-modeler', label: { fr: 'Pâte à modeler', en: 'Play dough', es: 'Plastilina' }, emoji: '🟤' },
  { value: 'pate-sel', label: { fr: 'Pâte à sel', en: 'Salt dough', es: 'Masa de sal' }, emoji: '🟤' },
  { value: 'argile', label: { fr: 'Argile', en: 'Clay', es: 'Arcilla' }, emoji: '🟤' },
  { value: 'fil-laine', label: { fr: 'Fil / Laine', en: 'Yarn / Thread', es: 'Hilo / Lana' }, emoji: '🧶' },
  { value: 'tissus', label: { fr: 'Chutes de tissus', en: 'Fabric scraps', es: 'Retazos de tela' }, emoji: '🧵' },
  { value: 'feutrine', label: { fr: 'Feutrine', en: 'Felt', es: 'Fieltro' }, emoji: '🧵' },
  { value: 'paillettes', label: { fr: 'Paillettes', en: 'Glitter', es: 'Purpurina' }, emoji: '✨' },
  { value: 'gommettes', label: { fr: 'Gommettes', en: 'Stickers', es: 'Pegatinas' }, emoji: '⭐' },
  { value: 'yeux-mobiles', label: { fr: 'Yeux mobiles', en: 'Googly eyes', es: 'Ojos móviles' }, emoji: '👀' },
  { value: 'pompons', label: { fr: 'Pompons', en: 'Pom poms', es: 'Pompones' }, emoji: '🔴' },
  { value: 'feuilles', label: { fr: 'Feuilles d\'arbres', en: 'Leaves', es: 'Hojas' }, emoji: '🍂' },
  { value: 'branches', label: { fr: 'Branches / Bâtons', en: 'Sticks / Twigs', es: 'Ramas / Palitos' }, emoji: '🪵' },
  { value: 'pierres', label: { fr: 'Pierres / Galets', en: 'Stones / Pebbles', es: 'Piedras' }, emoji: '🪨' },
  { value: 'coquillages', label: { fr: 'Coquillages', en: 'Shells', es: 'Conchas' }, emoji: '🐚' },
  { value: 'sable', label: { fr: 'Sable', en: 'Sand', es: 'Arena' }, emoji: '🏖️' },
  { value: 'graines', label: { fr: 'Graines', en: 'Seeds', es: 'Semillas' }, emoji: '🌱' },
  { value: 'rouleaux-carton', label: { fr: 'Rouleaux carton (PQ)', en: 'Toilet paper rolls', es: 'Rollos de cartón' }, emoji: '🧻' },
  { value: 'boite-oeufs', label: { fr: 'Boîte à œufs', en: 'Egg carton', es: 'Caja de huevos' }, emoji: '🥚' },
  { value: 'bouchons', label: { fr: 'Bouchons', en: 'Bottle caps', es: 'Tapones' }, emoji: '🔴' },
  { value: 'bouteilles-plastique', label: { fr: 'Bouteilles plastique', en: 'Plastic bottles', es: 'Botellas de plástico' }, emoji: '🧴' },
  { value: 'journaux', label: { fr: 'Journaux / Magazines', en: 'Newspapers / Magazines', es: 'Periódicos / Revistas' }, emoji: '📰' },
  { value: 'farine', label: { fr: 'Farine', en: 'Flour', es: 'Harina' }, emoji: '🌾' },
  { value: 'sel', label: { fr: 'Sel', en: 'Salt', es: 'Sal' }, emoji: '🧂' },
  { value: 'eau', label: { fr: 'Eau', en: 'Water', es: 'Agua' }, emoji: '💧' },
  { value: 'colorants-alimentaires', label: { fr: 'Colorants alimentaires', en: 'Food coloring', es: 'Colorantes alimentarios' }, emoji: '🎨' },
  { value: 'bicarbonate', label: { fr: 'Bicarbonate', en: 'Baking soda', es: 'Bicarbonato' }, emoji: '🧪' },
  { value: 'riz', label: { fr: 'Riz', en: 'Rice', es: 'Arroz' }, emoji: '🍚' },
  { value: 'pates-seches', label: { fr: 'Pâtes sèches', en: 'Dry pasta', es: 'Pasta seca' }, emoji: '🍝' },
  { value: 'lentilles', label: { fr: 'Lentilles', en: 'Lentils', es: 'Lentejas' }, emoji: '🫘' },
  { value: 'coton', label: { fr: 'Coton / Ouate', en: 'Cotton', es: 'Algodón' }, emoji: '☁️' },
  { value: 'regle', label: { fr: 'Règle', en: 'Ruler', es: 'Regla' }, emoji: '📏' },
  { value: 'eponge', label: { fr: 'Éponge', en: 'Sponge', es: 'Esponja' }, emoji: '🧽' },
  { value: 'batons-glace', label: { fr: 'Bâtons de glace', en: 'Popsicle sticks', es: 'Palitos de helado' }, emoji: '🍦' },
  { value: 'pailles', label: { fr: 'Pailles', en: 'Straws', es: 'Pajitas' }, emoji: '🥤' },
  { value: 'ballons', label: { fr: 'Ballons de baudruche', en: 'Balloons', es: 'Globos' }, emoji: '🎈' },
  { value: 'imprimante', label: { fr: 'Imprimante', en: 'Printer', es: 'Impresora' }, emoji: '🖨️' },
  { value: 'plastifieuse', label: { fr: 'Plastifieuse', en: 'Laminator', es: 'Plastificadora' }, emoji: '📋' },
]

interface StepMetadataProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepMetadata({ formData, updateFormData, lang }: StepMetadataProps) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)
  const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null)
  const [hoveredIntensity, setHoveredIntensity] = useState<string | null>(null)
  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null)
  const [urlDraft, setUrlDraft] = useState('')

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // ── Themes ──
  const handleAddTheme = (value: string, isCustom: boolean) => {
    if (formData.themes.includes(value)) return
    updateFormData({
      themes: [...formData.themes, value],
      customThemes: isCustom ? [...formData.customThemes, value] : formData.customThemes,
    })
  }
  const handleRemoveTheme = (value: string) => {
    updateFormData({
      themes: formData.themes.filter(t => t !== value),
      customThemes: formData.customThemes.filter(t => t !== value),
    })
  }

  // ── Competences ──
  const handleAddCompetence = (value: string, isCustom: boolean) => {
    if (formData.competences.includes(value)) return
    updateFormData({
      competences: [...formData.competences, value],
      customCompetences: isCustom ? [...formData.customCompetences, value] : formData.customCompetences,
    })
  }
  const handleRemoveCompetence = (value: string) => {
    updateFormData({
      competences: formData.competences.filter(c => c !== value),
      customCompetences: formData.customCompetences.filter(c => c !== value),
    })
  }

  // ── Materials ──
  const toggleBudget = (value: string) => {
    const current = formData.materials
    updateFormData({
      materials: current.includes(value) ? current.filter(m => m !== value) : [...current, value],
    })
  }

  const handleAddMaterial = (value: string, isCustom: boolean) => {
    if (formData.materiel_json.some(m => m.item === value)) return
    const newItem: MaterielItem = { item: value, recup: false, isCustom }
    updateFormData({ materiel_json: [...formData.materiel_json, newItem] })
  }

  const handleRemoveMaterial = (value: string) => {
    updateFormData({ materiel_json: formData.materiel_json.filter(m => m.item !== value) })
  }

  const toggleRecup = (index: number) => {
    const updated = [...formData.materiel_json]
    updated[index].recup = !updated[index].recup
    updateFormData({ materiel_json: updated })
  }

  const toggleUrlEdit = (index: number) => {
    if (editingUrlIndex === index) { setEditingUrlIndex(null); setUrlDraft('') }
    else { setEditingUrlIndex(index); setUrlDraft(formData.materiel_json[index].url || '') }
  }

  const saveUrl = (index: number) => {
    const updated = [...formData.materiel_json]
    updated[index] = { ...updated[index], url: urlDraft.trim() || undefined }
    updateFormData({ materiel_json: updated })
    setEditingUrlIndex(null); setUrlDraft('')
  }

  const getMaterialLabel = (item: string) => predefinedMaterials.find(m => m.value === item)?.label[lang] ?? item

  // ── Pedagogy helpers ──
  const intensities = [
    { value: 'leger', label: t.intensityLeger, desc: t.intensityLegerDesc },
    { value: 'moyen', label: t.intensityMoyen, desc: t.intensityMoyenDesc },
    { value: 'intense', label: t.intensityIntense, desc: t.intensityIntenseDesc },
  ]
  const difficulties = [
    { value: 'beginner', label: t.easy, desc: t.easyDesc },
    { value: 'advanced', label: t.medium, desc: t.mediumDesc },
    { value: 'expert', label: t.hard, desc: t.hardDesc },
  ]
  const intensityColors = ['bg-green-100 border-green-400 text-green-700', 'bg-yellow-100 border-yellow-400 text-yellow-700', 'bg-orange-100 border-orange-400 text-orange-700']
  const difficultyColors = ['bg-green-100 border-green-400 text-green-700', 'bg-yellow-100 border-yellow-400 text-yellow-700', 'bg-orange-100 border-orange-400 text-orange-700']

  // ── Autonomy gem ──
  const gem = GEMS.sage
  const rgb = hexToRgb(isDark ? gem.dark : gem.light)
  const glowRGB = isDark ? gem.glowDark : gem.glow
  const isOn = !!formData.autonomie

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E] dark:text-white">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 dark:text-white/50 mt-1">{t.subtitle}</p>
      </div>

      {/* ── THÈMES ── */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">{t.themes}</label>
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

      {/* ── COMPÉTENCES ── */}
      <div className="pb-4">
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">{t.competences}</label>
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

      {/* ── PÉDAGOGIE ── */}
      <div className="space-y-6 pt-2 pb-4 border-t border-[#E5E7EB] dark:border-white/8">
        <h3 className="text-sm font-semibold text-[#5D5A4E]/70 dark:text-white/50 uppercase tracking-wider pt-2">{t.pedagogy}</h3>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">{t.ageRange}</label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.ageFrom}</span>
            <select
              value={formData.age_min ?? ''}
              onChange={(e) => updateFormData({ age_min: e.target.value ? parseInt(e.target.value) : null })}
              className="px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
            >
              <option value="">-</option>
              {ageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label} {t.years}</option>)}
            </select>
            <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.ageTo}</span>
            <select
              value={formData.age_max ?? ''}
              onChange={(e) => updateFormData({ age_max: e.target.value ? parseInt(e.target.value) : null })}
              className="px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
            >
              <option value="">-</option>
              {ageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label} {t.years}</option>)}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">{t.duration}</label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="1" max="180" value={formData.duration ?? ''} placeholder="30"
                onChange={(e) => updateFormData({ duration: e.target.value ? parseInt(e.target.value) : null })}
                className="w-24 px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
              />
              <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.minutes}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">{t.durationPrep}</label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="0" max="120" value={formData.duration_prep ?? ''} placeholder="10"
                onChange={(e) => updateFormData({ duration_prep: e.target.value ? parseInt(e.target.value) : null })}
                className="w-24 px-4 py-2 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-[#A8B5A0] outline-none"
              />
              <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40">{t.minutes}</span>
            </div>
          </div>
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">{t.intensity}</label>
          <div className="grid grid-cols-3 gap-3">
            {intensities.map((int, i) => (
              <div key={int.value} className="relative">
                <button
                  type="button"
                  onClick={() => updateFormData({ intensity: int.value as 'leger' | 'moyen' | 'intense' })}
                  onMouseEnter={() => setHoveredIntensity(int.value)}
                  onMouseLeave={() => setHoveredIntensity(null)}
                  className={`w-full p-3 rounded-xl border-2 text-center transition-all ${formData.intensity === int.value ? intensityColors[i] + ' border-current' : 'bg-white border-[#E5E7EB] hover:border-[#A8B5A0]/50 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'}`}
                >
                  <span className="mb-1 flex justify-center"><FilterIcon value={int.value} size={22} /></span>
                  <span className={`text-sm font-semibold ${formData.intensity === int.value ? '' : 'text-[#5D5A4E] dark:text-white'}`}>{int.label}</span>
                </button>
                {hoveredIntensity === int.value && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-[200px] text-center">
                    {int.desc}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-3">{t.difficulty}</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((diff, i) => (
              <div key={diff.value} className="relative">
                <button
                  type="button"
                  onClick={() => updateFormData({ difficulte: diff.value as 'beginner' | 'advanced' | 'expert' })}
                  onMouseEnter={() => setHoveredDifficulty(diff.value)}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                  className={`w-full p-3 rounded-xl border-2 text-center transition-all ${formData.difficulte === diff.value ? difficultyColors[i] + ' border-current' : 'bg-white border-[#E5E7EB] hover:border-[#A8B5A0]/50 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'}`}
                >
                  <span className={`text-sm font-semibold ${formData.difficulte === diff.value ? '' : 'text-[#5D5A4E] dark:text-white'}`}>{diff.label}</span>
                </button>
                {hoveredDifficulty === diff.value && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap z-10 max-w-[200px] text-center">
                    {diff.desc}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Autonomy Toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-xl transition-all duration-300"
          style={{
            background: isOn ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.18 : 0.22}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.12 : 0.14}) 100%)` : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
            border: isOn ? `1px solid rgba(${glowRGB},${isDark ? 0.3 : 0.25})` : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isOn ? `0 0 16px rgba(${glowRGB},${isDark ? 0.2 : 0.1})` : 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold transition-colors duration-300" style={{ color: isOn ? (isDark ? gem.textDark : gem.text) : isDark ? '#A1A1AA' : '#6B7280' }}>
              {t.autonomy}
            </span>
            <div className="group relative">
              <Info className="w-4 h-4 cursor-help" style={{ color: isOn ? `rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.6 : 0.5})` : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#5D5A4E] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-[250px] text-center">
                {t.autonomyDesc}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#5D5A4E]" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateFormData({ autonomie: !formData.autonomie })}
            className="relative w-14 h-7 rounded-full transition-all duration-300 active:scale-[0.96]"
            style={{
              background: isOn ? `linear-gradient(135deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.7 : 0.8}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.55 : 0.65}) 100%)` : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              boxShadow: isOn ? `0 0 10px rgba(${glowRGB},${isDark ? 0.4 : 0.25})` : 'none',
            }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full shadow-sm transition-transform duration-300"
              style={{
                transform: `translateX(${isOn ? '30px' : '4px'})`,
                background: '#fff',
                boxShadow: isOn ? `0 1px 3px rgba(0,0,0,0.15), 0 0 4px rgba(${glowRGB},0.2)` : '0 1px 3px rgba(0,0,0,0.15)',
              }}
            />
          </button>
        </div>
      </div>

      {/* ── MATÉRIEL ── */}
      <div className="space-y-6 pt-2 border-t border-[#E5E7EB] dark:border-white/8">
        <h3 className="text-sm font-semibold text-[#5D5A4E]/70 dark:text-white/50 uppercase tracking-wider pt-2">{t.materials}</h3>

        {/* Budget type */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">{t.budgetType}</label>
          <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mb-3">{t.budgetTypeHelp}</p>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map(opt => {
              const isSelected = formData.materials.includes(opt.value)
              const s = gemPillStyle('amber', isSelected, isDark)
              return (
                <button
                  key={opt.value} type="button" onClick={() => toggleBudget(opt.value)}
                  className="transition-all duration-300 active:scale-[0.97]" style={s.wrapper}
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

        {/* Materials list */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">{t.materialsList}</label>
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
          {formData.materiel_json.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.materiel_json.map((item, index) => (
                <div key={item.item} className="rounded-xl border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                  <div className="flex items-center gap-2 p-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FilterIcon value={item.item} size={16} />
                      <span className="text-sm font-medium text-[#5D5A4E] dark:text-white truncate">{getMaterialLabel(item.item)}</span>
                      {item.isCustom && <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /></span>}
                    </div>
                    <button
                      type="button" onClick={() => toggleUrlEdit(index)} title={t.linkHelp}
                      className={`p-1.5 rounded-lg transition-all ${item.url || editingUrlIndex === index ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-300' : 'text-[#5D5A4E]/30 hover:text-blue-500 hover:bg-blue-50 dark:text-white/20 dark:hover:text-blue-300 dark:hover:bg-blue-500/10'}`}
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button" onClick={() => toggleRecup(index)} title={t.recupHelp}
                      className={`p-1.5 rounded-lg transition-all ${item.recup ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'text-[#5D5A4E]/30 hover:text-green-500 hover:bg-green-50 dark:text-white/20'}`}
                    >
                      <Recycle className="w-4 h-4" />
                    </button>
                    <button
                      type="button" onClick={() => handleRemoveMaterial(item.item)}
                      className="p-1.5 text-[#5D5A4E]/30 hover:text-red-500 hover:bg-red-50 dark:text-white/20 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {editingUrlIndex === index && (
                    <div className="flex items-center gap-2 px-3 pb-3 pt-0">
                      <input
                        type="url" value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveUrl(index) } }}
                        placeholder={t.linkPlaceholder} autoFocus
                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-[#A8B5A0]/30 dark:border-white/10 bg-transparent dark:bg-white/5 focus:border-blue-400 outline-none dark:text-white dark:placeholder:text-white/30"
                      />
                      <button type="button" onClick={() => saveUrl(index)} className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
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
    </div>
  )
}
