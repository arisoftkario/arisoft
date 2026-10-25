import { CompanyInfo, ServiceItem, SoftwareModule, ProjectItem, AdvantageItem } from '@/types';

// Adresse publique du site (à remplacer par le nom de domaine définitif)
export const siteUrl = 'https://arisoft.vercel.app';

export const companyInfo: CompanyInfo = {
  name: 'ARISOFT',
  tagline: "Assistance informatique & gestion d'entreprise",
  heroHeadline: 'Vos solutions informatiques et de gestion, de A à Z.',
  heroSubtitle:
    'Logiciels de gestion, sites web, applications mobiles, caméras de surveillance et impression textile : un seul partenaire pour faire avancer votre entreprise.',
  phone: '+243980951694',
  phoneDisplay: '+243 980 951 694',
  phoneRaw: 'tel:+243980951694',
  whatsappUrl: 'https://wa.me/243980951694',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61593903946478',
  tiktokUrl: 'https://www.tiktok.com/@arisoft5',
  instagramUrl: 'https://www.instagram.com/arisoft2026/',
  address: 'Butembo, Nord-Kivu, RD Congo',
  streetAddress: 'Avenue Matokeo, Boulevard Joseph Kabila, Commune Kimemi',
  // À compléter pour une épingle précise sur la carte :
  // geo: { latitude: 0.14, longitude: 29.29 },  // Google Maps : clic droit sur l'agence → copier les coordonnées
  email: 'arisoft28@gmail.com',
  openingHours: 'Lundi au Samedi : 08h30 - 17h00',
  city: 'Butembo',
  province: 'Nord-Kivu',
  country: 'République Démocratique du Congo',
};

// Adresse affichée sur le site : rue (si renseignée) puis ville.
export const fullAddress = [companyInfo.streetAddress, companyInfo.address].filter(Boolean).join(', ');

export const softwareModules: SoftwareModule[] = [
  {
    id: 'commerce',
    slug: 'commerce',
    title: 'Commerce',
    subtitle: 'Point de vente, gestion des stocks et facturation',
    description:
      'Gérez vos ventes au comptoir, surveillez vos niveaux de stocks en temps réel et éditez vos reçus et factures normalisées sans coupure.',
    features: [
      'Caisse enregistreuse rapide et gestion code-barres',
      'Suivi des stocks avec alertes de rupture',
      'Facturation clients et gestion des créances',
      'Rapports journaliers des ventes et marges bénéficiaires',
    ],
  },
  {
    id: 'rh',
    slug: 'rh',
    title: 'Ressources humaines',
    subtitle: 'Paie, pointage, présences et dossiers du personnel',
    description:
      'Automatisez le calcul des bulletins de paie, contrôlez les présences et conservez les dossiers administratifs de vos employés en toute conformité.',
    features: [
      'Génération automatisée des bulletins de paie',
      'Suivi des congés, absences et contrats',
      'Calcul des cotisations sociales et taxes',
      'Registre du personnel centralisé et sécurisé',
    ],
  },
  {
    id: 'ong',
    slug: 'ong',
    title: 'ONG',
    subtitle: 'Suivi budgétaire multi-bailleurs et logistique de projets',
    description:
      'Pilotez les dépenses de vos subventions par bailleur de fonds, assurez la traçabilité complète des justificatifs et facilitez vos audits.',
    features: [
      'Gestion budgétaire multi-projets et devises multiples',
      'Rapprochement des dépenses avec les lignes de subventions',
      'Traçabilité complète des pièces justificatives pour audit',
      'Rapports financiers périodiques conformes aux bailleurs',
    ],
  },
  {
    id: 'restaurant',
    slug: 'restaurant',
    title: 'Restaurant',
    subtitle: 'Commandes en salle, gestion de cuisine et fiches techniques',
    description:
      'Synchronisez les commandes des serveurs directement avec la cuisine ou le bar, gérez vos tables et maîtrisez le coût de revient de vos recettes.',
    features: [
      'Prise de commande mobile ou sur écran tactile',
      'Envoi immédiat des tickets en cuisine ou au bar',
      'Déduction automatique des ingrédients du stock selon recettes',
      'Gestion des tables, additions fractionnées et clôture de caisse',
    ],
  },
  {
    id: 'hotellerie',
    slug: 'hotellerie',
    title: 'Hôtellerie',
    subtitle: 'Réservations, planning des chambres et facturation globale',
    description:
      'Gérez les arrivées et départs, visualisez le planning d’occupation de vos chambres et regroupez l’hébergement et les consommations sur une facture unique.',
    features: [
      'Planning visuel des réservations et des disponibilités',
      'Check-in et check-out rapides avec historique client',
      'Liaison directe avec le restaurant ou les services internes',
      'Facturation centralisée et statistiques de taux d’occupation',
    ],
  },
];

export const servicesData: ServiceItem[] = [
  {
    id: 'logiciels-gestion',
    slug: 'logiciels-de-gestion',
    title: 'Logiciels de gestion',
    shortDescription:
      'Solutions sur-mesure pour commerces, RH, ONG, restaurants et hôtels. Prenez le contrôle total de votre gestion quotidienne.',
    fullDescription:
      'Nos logiciels de gestion répondent aux réalités concrètes des entreprises locales. Fini les pertes de stocks, les calculs de paie manuels ou le manque de visibilité sur votre trésorerie. Nous configurons chaque module selon votre activité, formons vos équipes et assurons une assistance technique permanente.',
    iconName: 'LayoutDashboard',
    features: [
      'Modules spécialisés par corps de métier',
      'Installation locale sécurisée ou accès réseau',
      'Formation complète de vos équipes sur site',
      'Assistance technique réactive et sauvegardes régulières',
    ],
    ctaLabel: 'Demander un devis pour un logiciel',
  },
  {
    id: 'sites-web',
    slug: 'sites-web',
    title: 'Sites web',
    shortDescription:
      'Sites vitrines et plateformes professionnelles rapides, sécurisés et optimisés pour convertir vos visiteurs en clients sur mobile.',
    fullDescription:
      'Votre site web est votre première agence commerciale ouverte 24h/24. Nous concevons des sites modernes, légers et élégants, pensés spécifiquement pour charger instantanément sur smartphone et inciter immédiatement au contact direct par WhatsApp ou appel téléphonique.',
    iconName: 'Globe',
    features: [
      'Conception 100% adaptée aux écrans de smartphones',
      'Optimisation pour chargement ultra-rapide',
      'Boutons d’appel et WhatsApp intégrés pour conversion immédiate',
      'Référencement naturel (SEO local) pour être trouvé facilement',
    ],
    ctaLabel: 'Demander un devis site web',
  },
  {
    id: 'applications-mobiles',
    slug: 'applications-mobiles',
    title: 'Applications mobiles',
    shortDescription:
      'Applications Android et iOS performantes pour vos clients ou vos équipes sur le terrain, même en connexion limitée.',
    fullDescription:
      'Développez une application mobile intuitive pour fidéliser votre clientèle ou équiper vos équipes opérationnelles en déplacement. Nous concevons des applications robustes capables de fonctionner de manière fluide avec synchronisation intelligente dès qu’une connexion internet est disponible.',
    iconName: 'Smartphone',
    features: [
      'Développement compatible Android et iOS',
      'Interfaces claires, fluides et ergonomiques',
      'Prise en compte des modes hors-ligne',
      'Publication et maintenance sur les stores officiels',
    ],
    ctaLabel: 'Demander un devis application mobile',
  },
  {
    id: 'cameras-surveillance',
    slug: 'cameras-surveillance',
    title: 'Caméras de surveillance',
    shortDescription:
      'Installation et paramétrage de systèmes de vidéosurveillance haute définition avec visualisation à distance sur votre téléphone.',
    fullDescription:
      'Protégez vos locaux commerciaux, bureaux, entrepôts ou résidences. Nous installons du matériel certifié, configurons les enregistreurs numériques et paramétrons l’accès en direct sur votre smartphone afin que vous gardiez un œil sur vos biens à tout instant.',
    iconName: 'Cctv',
    features: [
      'Caméras haute définition (vision nocturne et détection)',
      'Visualisation en direct et relecture sur smartphone',
      'Câblage soigné et sécurisation des enregistrements',
      'Maintenance préventive et dépannage rapide',
    ],
    ctaLabel: 'Demander un devis vidéosurveillance',
  },
  {
    id: 'assistance-informatique',
    slug: 'assistance-informatique',
    title: 'Assistance informatique',
    shortDescription:
      'Maintenance préventive et curative de votre parc informatique, réseaux locaux, sécurisation des données et dépannage express.',
    fullDescription:
      'Une panne informatique ne doit jamais bloquer votre activité. Nous intervenons rapidement pour réparer vos ordinateurs, configurer vos réseaux locaux, éradiquer les virus et mettre en place des copies de sauvegarde fiables de vos données stratégiques.',
    iconName: 'Headphones',
    features: [
      'Dépannage matériel et logiciel rapide sur site ou à distance',
      'Configuration et sécurisation de réseaux d’entreprise (Wi-Fi, LAN)',
      'Sauvegardes automatiques et protection contre les pertes de données',
      'Contrats de maintenance mensuels pour parc informatique',
    ],
    ctaLabel: 'Demander une assistance informatique',
  },
  {
    id: 'impression-textile',
    slug: 'impression-textile',
    title: 'Impression textile',
    shortDescription:
      'Personnalisation professionnelle de t-shirts, polos, casquettes et tenues de travail pour valoriser l’image de votre entreprise.',
    fullDescription:
      'Renforcez la notoriété et la cohésion de votre entreprise avec des tenues professionnelles marquées à vos couleurs. Nous garantissons une impression textile de haute qualité, durable aux lavages, idéale pour uniformes de travail, salons, événements ou campagnes promotionnelles.',
    iconName: 'Shirt',
    features: [
      'Marquage net, résistant et haute définition',
      'T-shirts, polos, casquettes et gilets d’entreprise',
      'Commandes en petite, moyenne ou grande série',
      'Respect strict des délais pour vos événements',
    ],
    ctaLabel: 'Demander un devis impression textile',
  },
];

export const softwareKeyHighlights = [
  {
    id: '1',
    title: 'Adapté module par module',
    description: 'Vous ne payez et n’utilisez que les fonctionnalités nécessaires à votre secteur d’activité.',
  },
  {
    id: '2',
    title: 'Installation et formation',
    description: 'Nos techniciens installent la solution sur vos postes et forment vos équipes jusqu’à parfaite maîtrise.',
  },
  {
    id: '3',
    title: 'Rapports clairs',
    description: 'Bénéficiez de tableaux de bord lisibles pour décider vite : ventes du jour, niveau de trésorerie et alertes stocks.',
  },
  {
    id: '4',
    title: 'Assistance et mises à jour',
    description: 'Une équipe technique joignable directement par téléphone et WhatsApp pour vous accompagner au quotidien.',
  },
];

export const projectRealizations: ProjectItem[] = [
  {
    id: '1',
    title: 'Déploiement logiciel de gestion commerciale',
    clientName: '',
    serviceCategory: 'Logiciel de gestion',
    imagePlaceholder: '',
    description:
      'Informatisation intégrale des points de vente, gestion des stocks multi-dépôts et formation des caissiers.',
  },
  {
    id: '2',
    title: 'Système de vidéosurveillance 16 caméras HD',
    clientName: '',
    serviceCategory: 'Caméras de surveillance',
    imagePlaceholder: '',
    description:
      'Sécurisation des accès entrepôts et bureaux administratifs avec contrôle à distance sur smartphone du gérant.',
  },
  {
    id: '3',
    title: 'Site web professionnel et identité visuelle',
    clientName: '',
    serviceCategory: 'Site web & Textile',
    imagePlaceholder: '',
    description:
      'Conception d’un site web optimisé mobile et confection de polos personnalisés pour le personnel d’accueil.',
  },
];

export const clientLogos = [
  {
    id: 'kisusi-vehicules',
    name: 'KISUSI COMPANY',
    activity: 'Export & logistique de véhicules',
    location: 'Butembo, Nord-Kivu',
    logo: '/images/clients/kisusi-vehicules.jpg',
  },
  {
    id: 'kisusi-tontine',
    name: 'KISUSI COMPANY',
    activity: 'Gestion de tontine commerciale',
    location: 'Butembo, Nord-Kivu',
    logo: '/images/clients/kisusi-tontine.jpg',
  },
  {
    id: 'gm-foundation',
    name: 'GM FOUNDATION COMPANY LTD',
    activity: 'Site web professionnel',
    location: 'Support world change',
    logo: '/images/clients/gm-foundation.jpg',
  },
];

export const advantagesData: AdvantageItem[] = [
  {
    id: '1',
    title: 'Un seul interlocuteur',
    description:
      'Logiciel, site web, parc informatique, caméras et tenues : vous échangez avec un seul partenaire de confiance pour tout votre système.',
    iconName: 'UserCheck',
  },
  {
    id: '2',
    title: 'Proximité',
    description:
      'Une équipe locale disponible, capable d’intervenir dans vos locaux sans délai pour vous dépanner ou ajuster vos configurations.',
    iconName: 'MapPin',
  },
  {
    id: '3',
    title: 'Formation incluse',
    description:
      'Nous ne livrons aucun outil sans former vos collaborateurs. Vos équipes deviennent immédiatement autonomes et productives.',
    iconName: 'GraduationCap',
  },
  {
    id: '4',
    title: 'Suivi après livraison',
    description:
      'Notre engagement se poursuit après le déploiement : assistance téléphonique réactive, sauvegardes et mises à jour continues.',
    iconName: 'ShieldCheck',
  },
];

export const navigationLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Logiciel de gestion', href: '/logiciel-de-gestion/' },
  { label: 'Réalisations', href: '/realisations/' },
  { label: 'Offres', href: '/publicites/' },
  { label: 'Contact', href: '/contact/' },
];
