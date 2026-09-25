export interface ApparelModelInfo {
  productId: string;
  id: string;
  name: string;
  shortName: string;
  category: string;
  sourceType: 'gltf' | 'procedural';
  glbUrl?: string;
  fileSize?: string;
  badge: string;
  badgeColor: string;
  license: string;
  author: string;
  description: string;
  materialArchitecture: string;
  customizableIn3D: {
    bodyColor: boolean;
    sleeveColor: boolean;
    collarColor: boolean;
    pattern: boolean;
    playerText: boolean;
    logoBadge: boolean;
  };
  customizationNotes: string;
}

export const APPAREL_MODELS: ApparelModelInfo[] = [
  {
    productId: 'sujaya-sj-01',
    id: 'sujaya-sj-01',
    name: 'Polo SJ-01',
    shortName: 'SJ-01',
    category: 'Jersey',
    sourceType: 'gltf',
    glbUrl: 'https://ik.imagekit.io/digidstudio/jersey_revisi.glb',
    fileSize: '222 KB',
    badge: 'SJ-01',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    license: 'Test Asset',
    author: 'Sujaya',
    description: 'SJ-01 Jersey 3D model asset configured using the working unified Athletic Fit template for compatibility testing.',
    materialArchitecture: 'Single Unified PBR Material (lambert1)',
    customizableIn3D: {
      bodyColor: true,
      sleeveColor: false,
      collarColor: false,
      pattern: true,
      playerText: true,
      logoBadge: true,
    },
    customizationNotes:
      'This real GLB model uses a single unified PBR fabric mesh. Body color tints the full jersey; chest crest and player text are rendered via dynamic decals. Sleeve and collar accent colors are mapped to the 2D production spec.',
  },
  {
    productId: 'digid-vanguard-esports-jersey',
    id: 'digid-vanguard-esports-jersey',
    name: 'DIGID Vanguard Esports',
    shortName: 'Vanguard',
    category: 'Jersey — No Collar',
    sourceType: 'gltf',
    glbUrl: '/models/athletic_jersey.glb',
    fileSize: '1.0 MB',
    badge: 'Jersey — No Collar',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    license: 'Real GLB Asset',
    author: 'Three.js / Free 3D Assets',
    description: 'Jersey — No Collar',
    materialArchitecture: 'Single Unified PBR Material (lambert1)',
    customizableIn3D: {
      bodyColor: true,
      sleeveColor: false,
      collarColor: false,
      pattern: true,
      playerText: true,
      logoBadge: true,
    },
    customizationNotes:
      'This real GLB model uses a single unified PBR fabric mesh. Body color tints the full jersey; chest crest and player text are rendered via dynamic decals. Sleeve and collar accent colors are mapped to the 2D production spec.',
  },
  {
    productId: 'apex-running-futsal-jersey',
    id: 'apex-running-futsal-jersey',
    name: 'Apex Running & Futsal Performance Jersey',
    shortName: 'Apex Performance',
    category: 'Real 3D Asset',
    sourceType: 'gltf',
    glbUrl: '/models/pro_jersey.glb',
    fileSize: '9.1 MB',
    badge: 'CLO3D GLB',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    license: 'CC-BY-4.0',
    author: 'DJM (Sketchfab)',
    description: 'High-density cloth simulation mesh with realistic fabric drape, seams, and 4K UV sublimation template.',
    materialArchitecture: 'Single High-Density Cloth Mesh',
    customizableIn3D: {
      bodyColor: true,
      sleeveColor: false,
      collarColor: false,
      pattern: false,
      playerText: false,
      logoBadge: true,
    },
    customizationNotes:
      'High-fidelity CLO3D cloth drape simulation. Responds to real-time PBR color tinting and chest badge placement. The companion 4K UV pattern template is available for 2D production unfolding.',
  },
  {
    productId: 'modular-segmented-jersey',
    id: 'modular-segmented-jersey',
    name: 'Modular Segmented Jersey (Procedural)',
    shortName: 'Modular 3D',
    category: 'Segmented Architecture',
    sourceType: 'procedural',
    fileSize: 'Procedural',
    badge: 'Multi-Part 3D',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    license: 'Project Custom',
    author: 'Configurator Engine',
    description: 'Multi-mesh architecture with separate front torso, back torso, left/right sleeves, and ribbed collar.',
    materialArchitecture: '4 Distinct Mesh Materials (Body, Sleeves, Collar, Back)',
    customizableIn3D: {
      bodyColor: true,
      sleeveColor: true,
      collarColor: true,
      pattern: true,
      playerText: true,
      logoBadge: true,
    },
    customizationNotes:
      'Features full material separation where Body, Sleeves, and Collar each have their own independent materials, allowing distinct colors for every individual garment piece in 3D.',
  },
];

export function getApparelModelByProductId(productId: string): ApparelModelInfo | undefined {
  return APPAREL_MODELS.find(
    (m) => m.productId === productId || m.id === productId
  );
}
