import type { Language } from '@/lib/types'
import type { GemColor } from '@/components/ui/button'

// Type pour les items avec traductions
export interface FilterOption {
  value: string
  label: Record<Language, string>
  emoji?: string
  group?: string // pour regrouper dans l'UI
  gem?: GemColor  // couleur gemme pour les boutons de catégorie
}

// ==========================================
// TYPES DE BUDGET MATÉRIEL
// ==========================================
export const BUDGET_TYPES: FilterOption[] = [
  { value: 'sans-materiel', label: { fr: 'Sans matériel', en: 'No materials', es: 'Sin material' }, emoji: '✨' },
  { value: 'maison', label: { fr: 'Matériel maison', en: 'Household items', es: 'Artículos del hogar' }, emoji: '🏠' },
  { value: 'nature', label: { fr: 'Matériel nature', en: 'Natural materials', es: 'Materiales naturales' }, emoji: '🌿' },
  { value: 'recup', label: { fr: 'Récup', en: 'Recycled', es: 'Reciclado' }, emoji: '♻️' },
  { value: 'petit-budget', label: { fr: 'Petit budget', en: 'Budget-friendly', es: 'Económico' }, emoji: '💰' },
  { value: 'investissement', label: { fr: 'Investissement', en: 'Investment', es: 'Inversión' }, emoji: '🛒' },
]

// ==========================================
// CATÉGORIES (Types d'activité) - Liste fermée
// ==========================================
export const CATEGORIES: FilterOption[] = [
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

// ==========================================
// THÈMES - Avec groupes
// ==========================================
export const THEMES: FilterOption[] = [
  // Saisons
  { value: 'Printemps', label: { fr: 'Printemps', en: 'Spring', es: 'Primavera' }, emoji: '🌸', group: 'seasons' },
  { value: 'Été', label: { fr: 'Été', en: 'Summer', es: 'Verano' }, emoji: '☀️', group: 'seasons' },
  { value: 'Automne', label: { fr: 'Automne', en: 'Fall', es: 'Otoño' }, emoji: '🍂', group: 'seasons' },
  { value: 'Hiver', label: { fr: 'Hiver', en: 'Winter', es: 'Invierno' }, emoji: '❄️', group: 'seasons' },
  // Fêtes
  { value: 'Noël', label: { fr: 'Noël', en: 'Christmas', es: 'Navidad' }, emoji: '🎄', group: 'holidays' },
  { value: 'Pâques', label: { fr: 'Pâques', en: 'Easter', es: 'Pascua' }, emoji: '🐰', group: 'holidays' },
  { value: 'Halloween', label: { fr: 'Halloween', en: 'Halloween', es: 'Halloween' }, emoji: '🎃', group: 'holidays' },
  { value: 'Saint-Valentin', label: { fr: 'Saint-Valentin', en: "Valentine's Day", es: 'San Valentín' }, emoji: '💕', group: 'holidays' },
  { value: 'Fête des mères', label: { fr: 'Fête des mères', en: "Mother's Day", es: 'Día de la madre' }, emoji: '💐', group: 'holidays' },
  { value: 'Fête des pères', label: { fr: 'Fête des pères', en: "Father's Day", es: 'Día del padre' }, emoji: '👔', group: 'holidays' },
  { value: 'Carnaval', label: { fr: 'Carnaval', en: 'Carnival', es: 'Carnaval' }, emoji: '🎭', group: 'holidays' },
  // Nature & environnement
  { value: 'Nature', label: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' }, emoji: '🌳', group: 'nature' },
  { value: 'Animaux', label: { fr: 'Animaux', en: 'Animals', es: 'Animales' }, emoji: '🐾', group: 'nature' },
  { value: 'Océan & mer', label: { fr: 'Océan & mer', en: 'Ocean & sea', es: 'Océano y mar' }, emoji: '🌊', group: 'nature' },
  { value: 'Jardin & plantes', label: { fr: 'Jardin & plantes', en: 'Garden & plants', es: 'Jardín y plantas' }, emoji: '🌱', group: 'nature' },
  { value: 'Forêt', label: { fr: 'Forêt', en: 'Forest', es: 'Bosque' }, emoji: '🌲', group: 'nature' },
  { value: 'Météo', label: { fr: 'Météo', en: 'Weather', es: 'Clima' }, emoji: '🌈', group: 'nature' },
  { value: 'Espace', label: { fr: 'Espace', en: 'Space', es: 'Espacio' }, emoji: '🚀', group: 'nature' },
  // Vie quotidienne
  { value: 'Maison', label: { fr: 'Maison', en: 'Home', es: 'Casa' }, emoji: '🏠', group: 'daily' },
  { value: 'Famille', label: { fr: 'Famille', en: 'Family', es: 'Familia' }, emoji: '👨‍👩‍👧', group: 'daily' },
  { value: 'École', label: { fr: 'École', en: 'School', es: 'Escuela' }, emoji: '🏫', group: 'daily' },
  { value: 'Transports', label: { fr: 'Transports', en: 'Transportation', es: 'Transporte' }, emoji: '🚗', group: 'daily' },
  { value: 'Alimentation', label: { fr: 'Alimentation', en: 'Food', es: 'Alimentación' }, emoji: '🍎', group: 'daily' },
  { value: 'Corps humain', label: { fr: 'Corps humain', en: 'Human body', es: 'Cuerpo humano' }, emoji: '🫀', group: 'daily' },
  // Imaginaire
  { value: 'Contes & Histoires', label: { fr: 'Contes & Histoires', en: 'Stories', es: 'Cuentos' }, emoji: '📚', group: 'fantasy' },
  { value: 'Dinosaures', label: { fr: 'Dinosaures', en: 'Dinosaurs', es: 'Dinosaurios' }, emoji: '🦕', group: 'fantasy' },
  { value: 'Pirates', label: { fr: 'Pirates', en: 'Pirates', es: 'Piratas' }, emoji: '🏴‍☠️', group: 'fantasy' },
  { value: 'Princesses', label: { fr: 'Princesses', en: 'Princesses', es: 'Princesas' }, emoji: '👸', group: 'fantasy' },
  { value: 'Super-héros', label: { fr: 'Super-héros', en: 'Superheroes', es: 'Superhéroes' }, emoji: '🦸', group: 'fantasy' },
  // Autres
  { value: 'Musique', label: { fr: 'Musique', en: 'Music', es: 'Música' }, emoji: '🎵', group: 'other' },
  { value: 'Couleurs', label: { fr: 'Couleurs', en: 'Colors', es: 'Colores' }, emoji: '🎨', group: 'other' },
  { value: 'Formes', label: { fr: 'Formes', en: 'Shapes', es: 'Formas' }, emoji: '🔷', group: 'other' },
  { value: 'Chiffres', label: { fr: 'Chiffres', en: 'Numbers', es: 'Números' }, emoji: '🔢', group: 'other' },
  { value: 'Lettres', label: { fr: 'Lettres', en: 'Letters', es: 'Letras' }, emoji: '🔤', group: 'other' },
]

export const THEME_GROUPS: Record<string, Record<Language, string>> = {
  seasons: { fr: 'Saisons', en: 'Seasons', es: 'Estaciones' },
  holidays: { fr: 'Fêtes', en: 'Holidays', es: 'Fiestas' },
  nature: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' },
  daily: { fr: 'Vie quotidienne', en: 'Daily life', es: 'Vida cotidiana' },
  fantasy: { fr: 'Imaginaire', en: 'Fantasy', es: 'Fantasía' },
  other: { fr: 'Autres', en: 'Other', es: 'Otros' },
}

// ==========================================
// COMPÉTENCES - Avec groupes
// ==========================================
export const COMPETENCES: FilterOption[] = [
  // Motricité
  { value: 'Motricité fine', label: { fr: 'Motricité fine', en: 'Fine motor skills', es: 'Motricidad fina' }, emoji: '✋', group: 'motor' },
  { value: 'Motricité globale', label: { fr: 'Motricité globale', en: 'Gross motor skills', es: 'Motricidad gruesa' }, emoji: '🤸', group: 'motor' },
  { value: 'Coordination', label: { fr: 'Coordination', en: 'Coordination', es: 'Coordinación' }, emoji: '🎯', group: 'motor' },
  { value: 'Équilibre', label: { fr: 'Équilibre', en: 'Balance', es: 'Equilibrio' }, emoji: '⚖️', group: 'motor' },
  // Cognitif
  { value: 'Logique & Maths', label: { fr: 'Logique & Maths', en: 'Logic & Math', es: 'Lógica y Matemáticas' }, emoji: '🔢', group: 'cognitive' },
  { value: 'Mémoire', label: { fr: 'Mémoire', en: 'Memory', es: 'Memoria' }, emoji: '🧠', group: 'cognitive' },
  { value: 'Concentration', label: { fr: 'Concentration', en: 'Focus', es: 'Concentración' }, emoji: '🎯', group: 'cognitive' },
  { value: 'Résolution de problèmes', label: { fr: 'Résolution de problèmes', en: 'Problem solving', es: 'Resolución de problemas' }, emoji: '💡', group: 'cognitive' },
  { value: 'Observation', label: { fr: 'Observation', en: 'Observation', es: 'Observación' }, emoji: '👁️', group: 'cognitive' },
  { value: 'Tri & classement', label: { fr: 'Tri & classement', en: 'Sorting & classifying', es: 'Clasificación' }, emoji: '📊', group: 'cognitive' },
  // Langage
  { value: 'Langage', label: { fr: 'Langage', en: 'Language', es: 'Lenguaje' }, emoji: '💬', group: 'language' },
  { value: 'Vocabulaire', label: { fr: 'Vocabulaire', en: 'Vocabulary', es: 'Vocabulario' }, emoji: '📖', group: 'language' },
  { value: 'Pré-lecture', label: { fr: 'Pré-lecture', en: 'Pre-reading', es: 'Pre-lectura' }, emoji: '📚', group: 'language' },
  { value: 'Pré-écriture', label: { fr: 'Pré-écriture', en: 'Pre-writing', es: 'Pre-escritura' }, emoji: '✏️', group: 'language' },
  // Créativité & expression
  { value: 'Créativité', label: { fr: 'Créativité', en: 'Creativity', es: 'Creatividad' }, emoji: '💡', group: 'creativity' },
  { value: 'Imagination', label: { fr: 'Imagination', en: 'Imagination', es: 'Imaginación' }, emoji: '🌈', group: 'creativity' },
  { value: 'Expression artistique', label: { fr: 'Expression artistique', en: 'Artistic expression', es: 'Expresión artística' }, emoji: '🎨', group: 'creativity' },
  // Émotionnel & social
  { value: 'Gestion des émotions', label: { fr: 'Gestion des émotions', en: 'Emotional regulation', es: 'Gestión emocional' }, emoji: '💚', group: 'emotional' },
  { value: 'Socialisation', label: { fr: 'Socialisation', en: 'Social skills', es: 'Socialización' }, emoji: '👥', group: 'emotional' },
  { value: 'Coopération', label: { fr: 'Coopération', en: 'Cooperation', es: 'Cooperación' }, emoji: '🤝', group: 'emotional' },
  { value: 'Patience', label: { fr: 'Patience', en: 'Patience', es: 'Paciencia' }, emoji: '⏳', group: 'emotional' },
  { value: 'Confiance en soi', label: { fr: 'Confiance en soi', en: 'Self-confidence', es: 'Confianza en sí mismo' }, emoji: '⭐', group: 'emotional' },
  // Autonomie
  { value: 'Autonomie', label: { fr: 'Autonomie', en: 'Independence', es: 'Autonomía' }, emoji: '🌟', group: 'autonomy' },
  { value: 'Vie pratique', label: { fr: 'Vie pratique', en: 'Practical life', es: 'Vida práctica' }, emoji: '🧹', group: 'autonomy' },
  // Sensoriel
  { value: 'Découverte sensorielle', label: { fr: 'Découverte sensorielle', en: 'Sensory discovery', es: 'Descubrimiento sensorial' }, emoji: '👀', group: 'sensory' },
  { value: 'Éveil musical', label: { fr: 'Éveil musical', en: 'Musical awakening', es: 'Despertar musical' }, emoji: '🎶', group: 'sensory' },
]

export const COMPETENCE_GROUPS: Record<string, Record<Language, string>> = {
  motor: { fr: 'Motricité', en: 'Motor skills', es: 'Motricidad' },
  cognitive: { fr: 'Cognitif', en: 'Cognitive', es: 'Cognitivo' },
  language: { fr: 'Langage', en: 'Language', es: 'Lenguaje' },
  creativity: { fr: 'Créativité', en: 'Creativity', es: 'Creatividad' },
  emotional: { fr: 'Émotionnel & social', en: 'Emotional & social', es: 'Emocional y social' },
  autonomy: { fr: 'Autonomie', en: 'Autonomy', es: 'Autonomía' },
  sensory: { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' },
}

// ==========================================
// MATÉRIAUX - Avec groupes
// ==========================================
export const MATERIALS: FilterOption[] = [
  // Papeterie
  { value: 'papier-blanc', label: { fr: 'Papier blanc', en: 'White paper', es: 'Papel blanco' }, emoji: '📄', group: 'paper' },
  { value: 'papier-couleur', label: { fr: 'Papier couleur', en: 'Colored paper', es: 'Papel de color' }, emoji: '📄', group: 'paper' },
  { value: 'papier-cartonne', label: { fr: 'Papier cartonné', en: 'Cardstock', es: 'Cartulina' }, emoji: '📄', group: 'paper' },
  { value: 'carton', label: { fr: 'Carton', en: 'Cardboard', es: 'Cartón' }, emoji: '📦', group: 'paper' },
  { value: 'carton-recup', label: { fr: 'Carton de récup', en: 'Recycled cardboard', es: 'Cartón reciclado' }, emoji: '📦', group: 'paper' },
  // Colles & adhésifs
  { value: 'colle-baton', label: { fr: 'Colle en bâton', en: 'Glue stick', es: 'Barra de pegamento' }, emoji: '🧴', group: 'glue' },
  { value: 'colle-liquide', label: { fr: 'Colle liquide', en: 'Liquid glue', es: 'Pegamento líquido' }, emoji: '🧴', group: 'glue' },
  { value: 'colle-chaude', label: { fr: 'Pistolet à colle', en: 'Hot glue gun', es: 'Pistola de silicona' }, emoji: '🔫', group: 'glue' },
  { value: 'scotch', label: { fr: 'Scotch / Ruban adhésif', en: 'Tape', es: 'Cinta adhesiva' }, emoji: '📎', group: 'glue' },
  { value: 'masking-tape', label: { fr: 'Masking tape', en: 'Masking tape', es: 'Cinta de carrocero' }, emoji: '📎', group: 'glue' },
  // Ciseaux & découpe
  { value: 'ciseaux', label: { fr: 'Ciseaux', en: 'Scissors', es: 'Tijeras' }, emoji: '✂️', group: 'cutting' },
  { value: 'ciseaux-cranteurs', label: { fr: 'Ciseaux cranteurs', en: 'Craft scissors', es: 'Tijeras decorativas' }, emoji: '✂️', group: 'cutting' },
  { value: 'perforatrice', label: { fr: 'Perforatrice', en: 'Hole punch', es: 'Perforadora' }, emoji: '🕳️', group: 'cutting' },
  // Écriture & dessin
  { value: 'crayons-couleur', label: { fr: 'Crayons de couleur', en: 'Colored pencils', es: 'Lápices de colores' }, emoji: '✏️', group: 'drawing' },
  { value: 'crayons-cire', label: { fr: 'Crayons de cire', en: 'Crayons', es: 'Crayones' }, emoji: '🖍️', group: 'drawing' },
  { value: 'feutres', label: { fr: 'Feutres', en: 'Markers', es: 'Rotuladores' }, emoji: '🖊️', group: 'drawing' },
  { value: 'feutres-lavables', label: { fr: 'Feutres lavables', en: 'Washable markers', es: 'Rotuladores lavables' }, emoji: '🖊️', group: 'drawing' },
  { value: 'stylos', label: { fr: 'Stylos', en: 'Pens', es: 'Bolígrafos' }, emoji: '🖊️', group: 'drawing' },
  { value: 'crayon-papier', label: { fr: 'Crayon à papier', en: 'Pencil', es: 'Lápiz' }, emoji: '✏️', group: 'drawing' },
  // Peinture
  { value: 'peinture-gouache', label: { fr: 'Peinture gouache', en: 'Gouache paint', es: 'Pintura gouache' }, emoji: '🎨', group: 'paint' },
  { value: 'peinture-acrylique', label: { fr: 'Peinture acrylique', en: 'Acrylic paint', es: 'Pintura acrílica' }, emoji: '🎨', group: 'paint' },
  { value: 'peinture-doigts', label: { fr: 'Peinture à doigts', en: 'Finger paint', es: 'Pintura de dedos' }, emoji: '🎨', group: 'paint' },
  { value: 'aquarelle', label: { fr: 'Aquarelle', en: 'Watercolor', es: 'Acuarela' }, emoji: '🎨', group: 'paint' },
  { value: 'pinceaux', label: { fr: 'Pinceaux', en: 'Brushes', es: 'Pinceles' }, emoji: '🖌️', group: 'paint' },
  { value: 'palette', label: { fr: 'Palette', en: 'Palette', es: 'Paleta' }, emoji: '🎨', group: 'paint' },
  { value: 'tablier', label: { fr: 'Tablier', en: 'Apron', es: 'Delantal' }, emoji: '👕', group: 'paint' },
  // Modelage
  { value: 'pate-modeler', label: { fr: 'Pâte à modeler', en: 'Play dough', es: 'Plastilina' }, emoji: '🟤', group: 'modeling' },
  { value: 'pate-sel', label: { fr: 'Pâte à sel', en: 'Salt dough', es: 'Masa de sal' }, emoji: '🟤', group: 'modeling' },
  { value: 'argile', label: { fr: 'Argile', en: 'Clay', es: 'Arcilla' }, emoji: '🟤', group: 'modeling' },
  { value: 'outils-modelage', label: { fr: 'Outils de modelage', en: 'Modeling tools', es: 'Herramientas de modelado' }, emoji: '🔧', group: 'modeling' },
  // Mercerie & couture
  { value: 'fil-laine', label: { fr: 'Fil / Laine', en: 'Yarn / Thread', es: 'Hilo / Lana' }, emoji: '🧶', group: 'sewing' },
  { value: 'aiguille-plastique', label: { fr: 'Aiguille plastique', en: 'Plastic needle', es: 'Aguja de plástico' }, emoji: '🪡', group: 'sewing' },
  { value: 'boutons', label: { fr: 'Boutons', en: 'Buttons', es: 'Botones' }, emoji: '🔘', group: 'sewing' },
  { value: 'tissus', label: { fr: 'Chutes de tissus', en: 'Fabric scraps', es: 'Retazos de tela' }, emoji: '🧵', group: 'sewing' },
  { value: 'feutrine', label: { fr: 'Feutrine', en: 'Felt', es: 'Fieltro' }, emoji: '🧵', group: 'sewing' },
  { value: 'rubans', label: { fr: 'Rubans', en: 'Ribbons', es: 'Cintas' }, emoji: '🎀', group: 'sewing' },
  // Décoration
  { value: 'paillettes', label: { fr: 'Paillettes', en: 'Glitter', es: 'Purpurina' }, emoji: '✨', group: 'deco' },
  { value: 'sequins', label: { fr: 'Sequins', en: 'Sequins', es: 'Lentejuelas' }, emoji: '✨', group: 'deco' },
  { value: 'gommettes', label: { fr: 'Gommettes', en: 'Stickers', es: 'Pegatinas' }, emoji: '⭐', group: 'deco' },
  { value: 'yeux-mobiles', label: { fr: 'Yeux mobiles', en: 'Googly eyes', es: 'Ojos móviles' }, emoji: '👀', group: 'deco' },
  { value: 'pompons', label: { fr: 'Pompons', en: 'Pom poms', es: 'Pompones' }, emoji: '🔴', group: 'deco' },
  { value: 'plumes', label: { fr: 'Plumes', en: 'Feathers', es: 'Plumas' }, emoji: '🪶', group: 'deco' },
  { value: 'perles', label: { fr: 'Perles', en: 'Beads', es: 'Cuentas' }, emoji: '📿', group: 'deco' },
  { value: 'chenilles', label: { fr: 'Fils chenille / Cure-pipes', en: 'Pipe cleaners', es: 'Limpiapipas' }, emoji: '🐛', group: 'deco' },
  // Nature
  { value: 'feuilles', label: { fr: "Feuilles d'arbres", en: 'Leaves', es: 'Hojas' }, emoji: '🍂', group: 'nature' },
  { value: 'fleurs', label: { fr: 'Fleurs / Pétales', en: 'Flowers / Petals', es: 'Flores / Pétalos' }, emoji: '🌸', group: 'nature' },
  { value: 'branches', label: { fr: 'Branches / Bâtons', en: 'Sticks / Twigs', es: 'Ramas / Palitos' }, emoji: '🪵', group: 'nature' },
  { value: 'pierres', label: { fr: 'Pierres / Galets', en: 'Stones / Pebbles', es: 'Piedras' }, emoji: '🪨', group: 'nature' },
  { value: 'coquillages', label: { fr: 'Coquillages', en: 'Shells', es: 'Conchas' }, emoji: '🐚', group: 'nature' },
  { value: 'sable', label: { fr: 'Sable', en: 'Sand', es: 'Arena' }, emoji: '🏖️', group: 'nature' },
  { value: 'terre', label: { fr: 'Terre', en: 'Soil', es: 'Tierra' }, emoji: '🪴', group: 'nature' },
  { value: 'graines', label: { fr: 'Graines', en: 'Seeds', es: 'Semillas' }, emoji: '🌱', group: 'nature' },
  // Récupération
  { value: 'rouleaux-carton', label: { fr: 'Rouleaux carton (PQ)', en: 'Toilet paper rolls', es: 'Rollos de cartón' }, emoji: '🧻', group: 'recycle' },
  { value: 'boite-oeufs', label: { fr: 'Boîte à œufs', en: 'Egg carton', es: 'Caja de huevos' }, emoji: '🥚', group: 'recycle' },
  { value: 'bouchons', label: { fr: 'Bouchons', en: 'Bottle caps', es: 'Tapones' }, emoji: '🔴', group: 'recycle' },
  { value: 'bouteilles-plastique', label: { fr: 'Bouteilles plastique', en: 'Plastic bottles', es: 'Botellas de plástico' }, emoji: '🧴', group: 'recycle' },
  { value: 'pots-yaourt', label: { fr: 'Pots de yaourt', en: 'Yogurt cups', es: 'Vasos de yogur' }, emoji: '🥛', group: 'recycle' },
  { value: 'boites-conserve', label: { fr: 'Boîtes de conserve', en: 'Tin cans', es: 'Latas' }, emoji: '🥫', group: 'recycle' },
  { value: 'journaux', label: { fr: 'Journaux / Magazines', en: 'Newspapers / Magazines', es: 'Periódicos / Revistas' }, emoji: '📰', group: 'recycle' },
  // Cuisine
  { value: 'farine', label: { fr: 'Farine', en: 'Flour', es: 'Harina' }, emoji: '🌾', group: 'kitchen' },
  { value: 'sel', label: { fr: 'Sel', en: 'Salt', es: 'Sal' }, emoji: '🧂', group: 'kitchen' },
  { value: 'eau', label: { fr: 'Eau', en: 'Water', es: 'Agua' }, emoji: '💧', group: 'kitchen' },
  { value: 'huile', label: { fr: 'Huile', en: 'Oil', es: 'Aceite' }, emoji: '🫒', group: 'kitchen' },
  { value: 'colorants-alimentaires', label: { fr: 'Colorants alimentaires', en: 'Food coloring', es: 'Colorantes alimentarios' }, emoji: '🎨', group: 'kitchen' },
  { value: 'vinaigre', label: { fr: 'Vinaigre', en: 'Vinegar', es: 'Vinagre' }, emoji: '🧪', group: 'kitchen' },
  { value: 'bicarbonate', label: { fr: 'Bicarbonate', en: 'Baking soda', es: 'Bicarbonato' }, emoji: '🧪', group: 'kitchen' },
  // Sensoriel
  { value: 'riz', label: { fr: 'Riz', en: 'Rice', es: 'Arroz' }, emoji: '🍚', group: 'sensory' },
  { value: 'pates-seches', label: { fr: 'Pâtes sèches', en: 'Dry pasta', es: 'Pasta seca' }, emoji: '🍝', group: 'sensory' },
  { value: 'lentilles', label: { fr: 'Lentilles', en: 'Lentils', es: 'Lentejas' }, emoji: '🫘', group: 'sensory' },
  { value: 'coton', label: { fr: 'Coton / Ouate', en: 'Cotton', es: 'Algodón' }, emoji: '☁️', group: 'sensory' },
  { value: 'mousse-raser', label: { fr: 'Mousse à raser', en: 'Shaving cream', es: 'Espuma de afeitar' }, emoji: '🧴', group: 'sensory' },
  { value: 'gel', label: { fr: 'Gel / Slime', en: 'Gel / Slime', es: 'Gel / Slime' }, emoji: '🟢', group: 'sensory' },
  // Outils
  { value: 'regle', label: { fr: 'Règle', en: 'Ruler', es: 'Regla' }, emoji: '📏', group: 'tools' },
  { value: 'compas', label: { fr: 'Compas', en: 'Compass', es: 'Compás' }, emoji: '📐', group: 'tools' },
  { value: 'eponge', label: { fr: 'Éponge', en: 'Sponge', es: 'Esponja' }, emoji: '🧽', group: 'tools' },
  { value: 'cure-dents', label: { fr: 'Cure-dents', en: 'Toothpicks', es: 'Palillos' }, emoji: '🪥', group: 'tools' },
  { value: 'batons-glace', label: { fr: 'Bâtons de glace', en: 'Popsicle sticks', es: 'Palitos de helado' }, emoji: '🍦', group: 'tools' },
  { value: 'pailles', label: { fr: 'Pailles', en: 'Straws', es: 'Pajitas' }, emoji: '🥤', group: 'tools' },
  { value: 'ballons', label: { fr: 'Ballons de baudruche', en: 'Balloons', es: 'Globos' }, emoji: '🎈', group: 'tools' },
  // Imprimante
  { value: 'imprimante', label: { fr: 'Imprimante', en: 'Printer', es: 'Impresora' }, emoji: '🖨️', group: 'print' },
  { value: 'plastifieuse', label: { fr: 'Plastifieuse', en: 'Laminator', es: 'Plastificadora' }, emoji: '📋', group: 'print' },
]

export const MATERIAL_GROUPS: Record<string, Record<Language, string>> = {
  paper: { fr: 'Papeterie', en: 'Paper & cardboard', es: 'Papelería' },
  glue: { fr: 'Colles & adhésifs', en: 'Glue & tape', es: 'Pegamentos' },
  cutting: { fr: 'Découpe', en: 'Cutting', es: 'Corte' },
  drawing: { fr: 'Écriture & dessin', en: 'Drawing', es: 'Dibujo' },
  paint: { fr: 'Peinture', en: 'Paint', es: 'Pintura' },
  modeling: { fr: 'Modelage', en: 'Modeling', es: 'Modelado' },
  sewing: { fr: 'Mercerie', en: 'Sewing', es: 'Mercería' },
  deco: { fr: 'Décoration', en: 'Decoration', es: 'Decoración' },
  nature: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' },
  recycle: { fr: 'Récupération', en: 'Recycled', es: 'Reciclaje' },
  kitchen: { fr: 'Cuisine', en: 'Kitchen', es: 'Cocina' },
  sensory: { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' },
  tools: { fr: 'Outils', en: 'Tools', es: 'Herramientas' },
  print: { fr: 'Impression', en: 'Printing', es: 'Impresión' },
}

// ==========================================
// OPTIONS DE DIFFICULTÉ
// ==========================================
export const DIFFICULTY_OPTIONS: FilterOption[] = [
  { value: 'beginner', label: { fr: 'Facile', en: 'Easy', es: 'Fácil' }, emoji: '🟢' },
  { value: 'advanced', label: { fr: 'Intermédiaire', en: 'Medium', es: 'Intermedio' }, emoji: '🟡' },
  { value: 'expert', label: { fr: 'Avancé', en: 'Advanced', es: 'Avanzado' }, emoji: '🔴' },
]

// ==========================================
// OPTIONS D'INTENSITÉ (pour jeux/activités physiques)
// ==========================================
export const INTENSITY_OPTIONS: FilterOption[] = [
  { value: 'leger', label: { fr: 'Léger', en: 'Light', es: 'Ligero' }, emoji: '🧘' },
  { value: 'moyen', label: { fr: 'Modéré', en: 'Moderate', es: 'Moderado' }, emoji: '🚶' },
  { value: 'intense', label: { fr: 'Intense', en: 'Intense', es: 'Intenso' }, emoji: '🏃' },
]

// ==========================================
// PRESETS DE DURÉE
// ==========================================
export const DURATION_PRESETS: FilterOption[] = [
  { value: '15', label: { fr: '< 15 min', en: '< 15 min', es: '< 15 min' }, emoji: '⚡' },
  { value: '30', label: { fr: '15-30 min', en: '15-30 min', es: '15-30 min' }, emoji: '⏱️' },
  { value: '60', label: { fr: '30-60 min', en: '30-60 min', es: '30-60 min' }, emoji: '⏰' },
  { value: '120', label: { fr: '1h+', en: '1h+', es: '1h+' }, emoji: '🕐' },
]

// ==========================================
// PRESETS DE DURÉE DE PRÉPARATION
// ==========================================
export const PREP_TIME_PRESETS: FilterOption[] = [
  { value: '0', label: { fr: 'Aucune', en: 'None', es: 'Ninguna' }, emoji: '✨' },
  { value: '5', label: { fr: '< 5 min', en: '< 5 min', es: '< 5 min' }, emoji: '⚡' },
  { value: '15', label: { fr: '5-15 min', en: '5-15 min', es: '5-15 min' }, emoji: '⏱️' },
  { value: '30', label: { fr: '15-30 min', en: '15-30 min', es: '15-30 min' }, emoji: '⏰' },
]

// ==========================================
// OPTIONS DE TRI
// ==========================================
export const SORT_OPTIONS: FilterOption[] = [
  { value: 'recent', label: { fr: 'Plus récents', en: 'Most recent', es: 'Más recientes' } },
  { value: 'popular', label: { fr: 'Populaires', en: 'Popular', es: 'Populares' } },
  { value: 'price_asc', label: { fr: 'Prix croissant', en: 'Price: low to high', es: 'Precio: menor a mayor' } },
  { value: 'price_desc', label: { fr: 'Prix décroissant', en: 'Price: high to low', es: 'Precio: mayor a menor' } },
]

// ==========================================
// TYPES DE RESSOURCE
// ==========================================
export const RESOURCE_TYPES: FilterOption[] = [
  { value: 'activite', label: { fr: 'Activité', en: 'Activity', es: 'Actividad' }, emoji: '🎨' },
  { value: 'motricite', label: { fr: 'Motricité', en: 'Motor skills', es: 'Motricidad' }, emoji: '🏃' },
  { value: 'alimentation', label: { fr: 'Recette', en: 'Recipe', es: 'Receta' }, emoji: '🍳' },
]

// ==========================================
// HELPERS
// ==========================================

/**
 * Récupère le label traduit d'une option
 */
export function getOptionLabel(options: FilterOption[], value: string, lang: Language): string {
  const option = options.find(o => o.value === value)
  return option?.label[lang] || value
}

/**
 * Récupère une option par sa valeur
 */
export function getOption(options: FilterOption[], value: string): FilterOption | undefined {
  return options.find(o => o.value === value)
}

/**
 * Groupe les options par leur propriété group
 */
export function groupOptions(options: FilterOption[]): Record<string, FilterOption[]> {
  return options.reduce((acc, option) => {
    const group = option.group || 'other'
    if (!acc[group]) acc[group] = []
    acc[group].push(option)
    return acc
  }, {} as Record<string, FilterOption[]>)
}

// ==========================================
// TRADUCTIONS UI DU SYSTÈME DE FILTRES
// ==========================================
export const FILTER_TRANSLATIONS = {
  fr: {
    filters: 'Filtres',
    clearAll: 'Tout effacer',
    apply: 'Appliquer',
    showResults: 'Voir {count} résultat(s)',
    noResults: 'Aucun résultat',

    // Sections
    categories: 'Type d\'activité',
    themes: 'Thèmes',
    competences: 'Compétences',
    materials: 'Matériel',
    practical: 'Pratique',
    price: 'Prix',

    // Filtres spécifiques
    age: 'Âge',
    ageRange: '{min} à {max}',
    months: 'mois',
    years: 'ans',
    duration: 'Durée',
    prepTime: 'Préparation',
    difficulty: 'Difficulté',
    intensity: 'Intensité',
    autonomy: 'Autonomie possible',
    autonomyHelp: 'L\'enfant peut faire seul',

    // Prix
    free: 'Gratuit',
    paid: 'Payant',
    priceRange: '{min} - {max} crédits',

    // Matériel
    materialMode: 'Mode matériel',
    modeFilter: 'Contient',
    modeMatch: 'J\'ai ce matériel',
    modeFilterHelp: 'Affiche les ressources contenant au moins un matériau sélectionné',
    modeMatchHelp: 'Affiche uniquement les ressources faisables avec le matériel possédé',

    // Créateur
    creator: 'Créateur',
    searchCreator: 'Rechercher un créateur...',

    // Tri
    sortBy: 'Trier par',
  },
  en: {
    filters: 'Filters',
    clearAll: 'Clear all',
    apply: 'Apply',
    showResults: 'Show {count} result(s)',
    noResults: 'No results',

    categories: 'Activity type',
    themes: 'Themes',
    competences: 'Skills',
    materials: 'Materials',
    practical: 'Practical',
    price: 'Price',

    age: 'Age',
    ageRange: '{min} to {max}',
    months: 'months',
    years: 'years',
    duration: 'Duration',
    prepTime: 'Prep time',
    difficulty: 'Difficulty',
    intensity: 'Intensity',
    autonomy: 'Can do alone',
    autonomyHelp: 'Child can do independently',

    free: 'Free',
    paid: 'Paid',
    priceRange: '{min} - {max} credits',

    materialMode: 'Material mode',
    modeFilter: 'Contains',
    modeMatch: 'I have this',
    modeFilterHelp: 'Shows resources containing at least one selected material',
    modeMatchHelp: 'Shows only resources doable with owned materials',

    creator: 'Creator',
    searchCreator: 'Search creator...',

    sortBy: 'Sort by',
  },
  es: {
    filters: 'Filtros',
    clearAll: 'Borrar todo',
    apply: 'Aplicar',
    showResults: 'Ver {count} resultado(s)',
    noResults: 'Sin resultados',

    categories: 'Tipo de actividad',
    themes: 'Temas',
    competences: 'Competencias',
    materials: 'Materiales',
    practical: 'Práctico',
    price: 'Precio',

    age: 'Edad',
    ageRange: '{min} a {max}',
    months: 'meses',
    years: 'años',
    duration: 'Duración',
    prepTime: 'Preparación',
    difficulty: 'Dificultad',
    intensity: 'Intensidad',
    autonomy: 'Puede hacer solo',
    autonomyHelp: 'El niño puede hacer solo',

    free: 'Gratis',
    paid: 'De pago',
    priceRange: '{min} - {max} créditos',

    materialMode: 'Modo material',
    modeFilter: 'Contiene',
    modeMatch: 'Tengo esto',
    modeFilterHelp: 'Muestra recursos que contienen al menos un material seleccionado',
    modeMatchHelp: 'Muestra solo recursos realizables con materiales poseídos',

    creator: 'Creador',
    searchCreator: 'Buscar creador...',

    sortBy: 'Ordenar por',
  }
}

export type FilterTranslations = typeof FILTER_TRANSLATIONS.fr
