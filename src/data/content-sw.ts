import { fullAddress } from '@/data/content';

// Page d'accueil en kiswahili (/sw/). À faire relire par un locuteur natif avant toute campagne.
// Les prestations ajoutées depuis l'admin ne sont pas traduites ici automatiquement.

export const swHero = {
  badge: 'Huduma za kompyuta na usimamizi wa biashara',
  headline: 'Suluhisho zako za kompyuta na usimamizi wa biashara, kutoka A hadi Z.',
  subtitle:
    'Programu za usimamizi, tovuti, programu za simu, mitandao ya kompyuta, usalama wa mtandao, kamera za ulinzi na uchapishaji wa nguo: mshirika mmoja kwa maendeleo ya biashara yako.',
  whatsapp: 'Tuandikie kwenye WhatsApp',
  whatsappMessage: 'Habari ARISOFT, ningependa kupata makisio ya bei.',
  call: 'Piga simu',
  reassurance: ['Makisio ya bei bure, bila masharti', 'Ufungaji na mafunzo mahali pako'],
};

// Clés = identifiants des services du catalogue (src/data/content.ts).
export const swServices = [
  {
    id: 'logiciels-gestion',
    iconName: 'LayoutDashboard',
    title: 'Programu za usimamizi',
    description:
      'Programu zilizoundwa kwa ajili ya maduka, wafanyakazi, mashirika (ONG), mikahawa, hoteli, shule, hospitali na makampuni ya ujenzi.',
  },
  {
    id: 'sites-web',
    iconName: 'Globe',
    title: 'Tovuti',
    description: 'Tovuti za kitaalamu, za haraka na salama, zilizoundwa kwa ajili ya simu ili wageni wako wawe wateja.',
  },
  {
    id: 'applications-mobiles',
    iconName: 'Smartphone',
    title: 'Programu za simu',
    description: 'Programu za Android na iOS kwa wateja wako au wafanyakazi wako, hata pale mtandao ukiwa dhaifu.',
  },
  {
    id: 'cameras-surveillance',
    iconName: 'Cctv',
    title: 'Kamera za ulinzi',
    description: 'Ufungaji wa kamera za ubora wa juu, na uwezo wa kuangalia kwa mbali kupitia simu yako.',
  },
  {
    id: 'reseaux-informatiques',
    iconName: 'Network',
    title: 'Mitandao ya kompyuta',
    description: 'Mtandao wa nyaya na Wi-Fi kwa ofisi, shule, hoteli na makampuni: muunganisho imara katika kila chumba.',
  },
  {
    id: 'cybersecurite',
    iconName: 'ShieldCheck',
    title: 'Usalama wa mtandao',
    description: 'Kulinda kompyuta, mitandao na data zako dhidi ya virusi, wadukuzi, utapeli mtandaoni na upotevu wa taarifa.',
  },
  {
    id: 'assistance-informatique',
    iconName: 'Headphones',
    title: 'Msaada wa kompyuta',
    description: 'Matengenezo ya kompyuta, kuondoa virusi na msaada wa haraka pale tatizo linapotokea.',
  },
  {
    id: 'impression-textile',
    iconName: 'Shirt',
    title: 'Uchapishaji wa nguo',
    description: 'Kuchapisha nembo ya kampuni yako kwenye fulana, shati za polo, kofia na sare za kazi.',
  },
];

// Clés = identifiants des modules du logiciel (src/data/content.ts).
export const swModuleTitles: Record<string, string> = {
  commerce: 'Biashara na maduka',
  rh: 'Wafanyakazi na mishahara',
  ong: 'Mashirika (ONG)',
  restaurant: 'Mikahawa',
  hotellerie: 'Hoteli',
  ecoles: 'Shule',
  hopitaux: 'Hospitali',
  btp: 'Ujenzi',
};

export const swSteps = [
  {
    title: 'Tunakusikiliza',
    description: 'Ujumbe wa WhatsApp, simu au kutembelea ofisi yetu: unatueleza kazi yako na mahitaji yako.',
  },
  {
    title: 'Makisio ya bei bure',
    description: 'Tunakupendekezea suluhisho linalokufaa na makisio ya bei yaliyo wazi, bila masharti yoyote.',
  },
  {
    title: 'Ufungaji na mafunzo',
    description: 'Mafundi wetu wanafunga kila kitu mahali pako na kuwafundisha wafanyakazi wako hadi waweze kujitegemea.',
  },
  {
    title: 'Ufuatiliaji wa kila siku',
    description: 'Baada ya kukabidhi, tunapatikana kwa simu na WhatsApp kwa msaada na masasisho.',
  },
];

export const swAdvantages = [
  {
    title: 'Mshirika mmoja',
    description: 'Programu, tovuti, mtandao, usalama, kamera na nguo: unashughulika na mshirika mmoja tu wa kuaminika.',
  },
  {
    title: 'Tuko karibu nawe',
    description: 'Timu ya hapa nyumbani, inayoweza kufika ofisini kwako haraka kukusaidia.',
  },
  {
    title: 'Mafunzo yamejumuishwa',
    description: 'Hatukabidhi chombo chochote bila kuwafundisha wafanyakazi wako jinsi ya kukitumia.',
  },
  {
    title: 'Ufuatiliaji baada ya kukabidhi',
    description: 'Msaada kwa simu, nakala za akiba za data zako na masasisho ya mara kwa mara.',
  },
];

export const swFaq = [
  {
    question: 'Je, makisio ya bei ni bure kweli?',
    answer:
      'Ndiyo. Tunachunguza mahitaji yako na kukupa makisio ya bei kwa kina bure na bila masharti. Kisha unaamua kwa uhuru.',
  },
  {
    question: 'Je, wafanyakazi wangu wataweza kutumia programu?',
    answer:
      'Mafunzo yamejumuishwa: tunawafundisha wafanyakazi wako mahali pako hadi waweze kuitumia vizuri, na tunabaki tayari kujibu maswali yao.',
  },
  {
    question: 'Je, programu ya usimamizi inafanya kazi bila intaneti?',
    answer:
      'Inaweza kufungwa kwenye kompyuta zako au kushirikishwa kwenye mtandao wako wa ndani: kazi yako haisimami intaneti ikikatika.',
  },
  {
    question: 'Nini kinatokea kukiwa na hitilafu?',
    answer:
      'Wasiliana nasi kwa simu au WhatsApp: tunasaidia kwa mbali au tunafika ofisini kwako. Mikataba ya matengenezo ya kila mwezi pia inawezekana.',
  },
  {
    question: 'Mnapokea njia gani za malipo?',
    answer: 'Pesa taslimu, Mobile Money na uhamisho wa benki, kwa dola za Kimarekani (USD) au faranga za Kongo (CDF).',
  },
  {
    question: 'ARISOFT iko wapi?',
    answer: `Ofisi yetu iko ${fullAddress}. Tunafungua Jumatatu hadi Jumamosi, kuanzia saa mbili na nusu asubuhi hadi saa kumi na moja jioni (08h30 – 17h00).`,
  },
];
