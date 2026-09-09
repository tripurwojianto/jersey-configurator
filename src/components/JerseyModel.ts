import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { JerseyConfig } from '../types/design';
import { JerseyMaterialManager } from './JerseyMaterial';
import { drawBackTextOverlay } from './TextOverlay';
import { loadLogoImage } from './LogoOverlay';

export interface ModelMetadata {
  isSeparatedMaterials: boolean;
  meshCount: number;
  materialNames: string[];
}

export class JerseyModel {
  public group: THREE.Group;
  public materialManager: JerseyMaterialManager;
  private proceduralGroup: THREE.Group;
  private gltfGroup: THREE.Group | null = null;
  private decalGroup: THREE.Group = new THREE.Group();
  public currentSource: 'procedural' | 'gltf' = 'procedural';
  public currentGlbUrl: string = '';
  private gltfLoader: GLTFLoader;
  private gltfMeshes: THREE.Mesh[] = [];
  private mainJerseyMesh: THREE.Mesh | null = null;
  public isLoading: boolean = false;
  public loadError: string | null = null;
  public modelMetadata: ModelMetadata = {
    isSeparatedMaterials: false,
    meshCount: 0,
    materialNames: [],
  };

  // Decal meshes for real 3D GLB
  private chestBadgeMesh: THREE.Mesh | null = null;
  private backTextMesh: THREE.Mesh | null = null;
  private backTextCanvas: HTMLCanvasElement;
  private backTextTexture: THREE.CanvasTexture;
  private badgeCanvas: HTMLCanvasElement;
  private badgeTexture: THREE.CanvasTexture;

  constructor(materialManager: JerseyMaterialManager) {
    this.materialManager = materialManager;
    this.group = new THREE.Group();
    this.proceduralGroup = new THREE.Group();
    this.gltfLoader = new GLTFLoader();

    // Canvases for decals
    this.backTextCanvas = document.createElement('canvas');
    this.backTextCanvas.width = 512;
    this.backTextCanvas.height = 512;
    this.backTextTexture = new THREE.CanvasTexture(this.backTextCanvas);
    this.backTextTexture.colorSpace = THREE.SRGBColorSpace;

    this.badgeCanvas = document.createElement('canvas');
    this.badgeCanvas.width = 256;
    this.badgeCanvas.height = 256;
    this.badgeTexture = new THREE.CanvasTexture(this.badgeCanvas);
    this.badgeTexture.colorSpace = THREE.SRGBColorSpace;

    this.group.add(this.proceduralGroup);
    this.group.add(this.decalGroup);
    this.buildProceduralJersey();
  }

  /**
   * Constructs the modular athletic jersey 3D geometry
   */
  private buildProceduralJersey() {
    while (this.proceduralGroup.children.length > 0) {
      const child = this.proceduralGroup.children[0];
      this.proceduralGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    const materials = this.materialManager.getMaterials();

    // 1. Front Torso Mesh
    const frontGeo = new THREE.CylinderGeometry(0.96, 0.88, 2.3, 32, 16, true, -Math.PI / 2, Math.PI);
    const frontUvs = frontGeo.attributes.uv;
    for (let i = 0; i < frontUvs.count; i++) {
      frontUvs.setX(i, 1.0 - frontUvs.getX(i));
    }
    frontUvs.needsUpdate = true;

    const frontTorsoMesh = new THREE.Mesh(frontGeo, materials.frontTorsoMaterial);
    frontTorsoMesh.name = 'frontTorso';
    frontTorsoMesh.scale.set(1.0, 1.0, 0.58);
    frontTorsoMesh.castShadow = true;
    frontTorsoMesh.receiveShadow = true;
    this.proceduralGroup.add(frontTorsoMesh);

    // 2. Back Torso Mesh
    const backGeo = new THREE.CylinderGeometry(0.96, 0.88, 2.3, 32, 16, true, Math.PI / 2, Math.PI);
    const backUvs = backGeo.attributes.uv;
    for (let i = 0; i < backUvs.count; i++) {
      backUvs.setX(i, 1.0 - backUvs.getX(i));
    }
    backUvs.needsUpdate = true;

    const backTorsoMesh = new THREE.Mesh(backGeo, materials.backTorsoMaterial);
    backTorsoMesh.name = 'backTorso';
    backTorsoMesh.scale.set(1.0, 1.0, 0.58);
    backTorsoMesh.castShadow = true;
    backTorsoMesh.receiveShadow = true;
    this.proceduralGroup.add(backTorsoMesh);

    // 3. Left Sleeve
    const sleeveGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.95, 24, 8, true);
    const leftSleeveMesh = new THREE.Mesh(sleeveGeo, materials.sleeveMaterial);
    leftSleeveMesh.name = 'leftSleeve';
    leftSleeveMesh.position.set(1.15, 0.65, 0);
    leftSleeveMesh.rotation.z = -Math.PI / 3.4;
    leftSleeveMesh.rotation.x = 0.08;
    leftSleeveMesh.scale.set(1.0, 1.0, 0.75);
    leftSleeveMesh.castShadow = true;
    this.proceduralGroup.add(leftSleeveMesh);

    // 4. Right Sleeve
    const rightSleeveMesh = new THREE.Mesh(sleeveGeo.clone(), materials.sleeveMaterial);
    rightSleeveMesh.name = 'rightSleeve';
    rightSleeveMesh.position.set(-1.15, 0.65, 0);
    rightSleeveMesh.rotation.z = Math.PI / 3.4;
    rightSleeveMesh.rotation.x = 0.08;
    rightSleeveMesh.scale.set(1.0, 1.0, 0.75);
    rightSleeveMesh.castShadow = true;
    this.proceduralGroup.add(rightSleeveMesh);

    // 5. Shoulder caps
    const leftShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), materials.sleeveMaterial);
    leftShoulderCap.position.set(0.85, 0.98, 0);
    leftShoulderCap.scale.set(0.9, 0.7, 0.6);
    this.proceduralGroup.add(leftShoulderCap);

    const rightShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), materials.sleeveMaterial);
    rightShoulderCap.position.set(-0.85, 0.98, 0);
    rightShoulderCap.scale.set(0.9, 0.7, 0.6);
    this.proceduralGroup.add(rightShoulderCap);

    // 6. Collar Band
    const collarGeo = new THREE.TorusGeometry(0.45, 0.075, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, materials.collarMaterial);
    collarMesh.name = 'collar';
    collarMesh.position.set(0, 1.12, 0.02);
    collarMesh.rotation.x = Math.PI / 2.1;
    collarMesh.scale.set(1.05, 0.8, 0.9);
    collarMesh.castShadow = true;
    this.proceduralGroup.add(collarMesh);

    // 7. Hem Bottom Trim
    const hemGeo = new THREE.TorusGeometry(0.88, 0.045, 12, 32);
    const hemMesh = new THREE.Mesh(hemGeo, materials.collarMaterial);
    hemMesh.name = 'hem';
    hemMesh.position.set(0, -1.14, 0);
    hemMesh.rotation.x = Math.PI / 2;
    hemMesh.scale.set(1.0, 0.58, 1.0);
    this.proceduralGroup.add(hemMesh);

    // 8. Interior mesh
    const interiorGeo = new THREE.CylinderGeometry(0.92, 0.84, 2.25, 16, 1, false);
    const interiorMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.BackSide });
    const interiorMesh = new THREE.Mesh(interiorGeo, interiorMat);
    interiorMesh.scale.set(0.98, 1.0, 0.56);
    this.proceduralGroup.add(interiorMesh);
  }

  /**
   * Load external GLB model from local public path or URL
   */
  public async loadExternalGlb(url: string, config: JerseyConfig): Promise<void> {
    this.isLoading = true;
    this.loadError = null;

    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        this.gltfLoader.load(
          url,
          (loaded) => resolve(loaded),
          undefined,
          (err) => reject(err)
        );
      });

      // Remove existing GLTF if any
      if (this.gltfGroup) {
        this.group.remove(this.gltfGroup);
      }

      this.gltfGroup = gltf.scene;
      this.gltfMeshes = [];
      this.mainJerseyMesh = null;

      // Auto-center and normalize scale to 2.4 height
      const box = new THREE.Box3().setFromObject(this.gltfGroup);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      this.gltfGroup.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const targetScale = 2.4 / maxDim;
        this.gltfGroup.scale.setScalar(targetScale);
      }

      // Collect meshes and analyze material separation
      const matNames: string[] = [];
      let hasSeparatedParts = false;

      this.gltfGroup.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          this.gltfMeshes.push(node);
          if (!this.mainJerseyMesh) this.mainJerseyMesh = node;

          const nName = (node.name || '').toLowerCase();
          if (
            nName.includes('sleeve') ||
            nName.includes('arm') ||
            nName.includes('collar') ||
            nName.includes('neck') ||
            nName.includes('back')
          ) {
            hasSeparatedParts = true;
          }

          if (node.material) {
            const mat = Array.isArray(node.material) ? node.material[0] : node.material;
            if (mat && mat.name && !matNames.includes(mat.name)) {
              matNames.push(mat.name);
            }
          }
        }
      });

      this.modelMetadata = {
        isSeparatedMaterials: hasSeparatedParts || matNames.length > 1,
        meshCount: this.gltfMeshes.length,
        materialNames: matNames,
      };

      // Apply initial materials based on config
      this.applyGltfMaterials(config);

      // Setup 3D Decals on GLB
      this.setupDecalsOnGlb(config);

      // Hide procedural, show GLTF & decals
      this.proceduralGroup.visible = false;
      this.gltfGroup.visible = true;
      this.decalGroup.visible = true;
      this.group.add(this.gltfGroup);

      this.currentGlbUrl = url;
      this.currentSource = 'gltf';
    } catch (err: any) {
      console.warn('Failed to load GLTF model, falling back to procedural:', err);
      this.loadError = `Failed to load model (${err?.message || 'Network/parse error'}). Using modular procedural jersey.`;
      this.proceduralGroup.visible = true;
      if (this.gltfGroup) this.gltfGroup.visible = false;
      this.decalGroup.visible = false;
      this.currentSource = 'procedural';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Apply / update materials on loaded GLTF meshes
   */
  private applyGltfMaterials(config: JerseyConfig) {
    if (!this.gltfGroup) return;
    const materials = this.materialManager.getMaterials();

    this.gltfGroup.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const name = (node.name || '').toLowerCase();

        if (this.modelMetadata.isSeparatedMaterials) {
          // Model has separate pieces
          if (name.includes('front') || name.includes('body')) {
            node.material = materials.frontTorsoMaterial;
          } else if (name.includes('back')) {
            node.material = materials.backTorsoMaterial;
          } else if (name.includes('sleeve') || name.includes('arm')) {
            node.material = materials.sleeveMaterial;
          } else if (name.includes('collar') || name.includes('neck') || name.includes('rib')) {
            node.material = materials.collarMaterial;
          } else {
            node.material = materials.frontTorsoMaterial;
          }
        } else {
          // Single unified mesh model (e.g., athletic_jersey.glb / pro_jersey.glb)
          // Attach the dynamic HTML5 CanvasTexture directly to the main material
          const unifiedTex = this.materialManager.getUnifiedTexture();

          if (node.material instanceof THREE.MeshStandardMaterial) {
            node.material.map = unifiedTex;
            node.material.color.set(0xffffff); // Pure white so canvas print colors render true
            node.material.roughness = 0.65;
            node.material.metalness = 0.05;
            node.material.side = THREE.DoubleSide;
            if (node.material.map) {
              node.material.map.needsUpdate = true;
            }
            node.material.needsUpdate = true;
          } else if (node.material) {
            // Preserve baked normalMap and aoMap for authentic athletic cloth wrinkles
            const oldMat = Array.isArray(node.material) ? node.material[0] : node.material;
            const newMat = new THREE.MeshStandardMaterial({
              map: unifiedTex,
              color: new THREE.Color(0xffffff),
              roughness: 0.65,
              metalness: 0.05,
              normalMap: (oldMat as any).normalMap || null,
              normalScale: (oldMat as any).normalScale || new THREE.Vector2(1.5, 1.5),
              aoMap: (oldMat as any).aoMap || null,
              side: THREE.DoubleSide,
            });
            node.material = newMat;
            node.material.needsUpdate = true;
          }
        }
      }
    });

    // Decals are rendered directly onto the main jersey dynamic canvas texture
    this.decalGroup.visible = false;
  }

  /**
   * Returns the primary 3D object to be exported as a GLB file.
   */
  public getExportObject(): THREE.Object3D {
    if (this.currentSource === 'gltf' && this.gltfGroup) {
      return this.gltfGroup;
    }
    return this.proceduralGroup;
  }

  /**
   * Sets up 3D decals for chest crest and back name/number on the GLB model
   */
  private setupDecalsOnGlb(config: JerseyConfig) {
    // Clear existing decals
    while (this.decalGroup.children.length > 0) {
      const child = this.decalGroup.children[0];
      this.decalGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    // 1. Chest Badge / Crest Decal Plane
    // Positioned at standard left-chest crest location (x: -0.22, y: 0.22, z: 0.42)
    // Scaled down ~22% (0.25x0.25) to match standard apparel crest proportions
    const badgeGeo = new THREE.PlaneGeometry(0.25, 0.25);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: this.badgeTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    this.chestBadgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    this.chestBadgeMesh.position.set(-0.22, 0.22, 0.41);
    this.chestBadgeMesh.rotation.y = 0.12; // slightly angle outward along chest curve
    this.decalGroup.add(this.chestBadgeMesh);

    // 2. Back Name & Number Decal Plane
    // Positioned on the upper back (x: 0, y: 0.22, z: -0.42)
    const backGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const backMat = new THREE.MeshBasicMaterial({
      map: this.backTextTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    this.backTextMesh = new THREE.Mesh(backGeo, backMat);
    this.backTextMesh.position.set(0, 0.2, -0.41);
    this.backTextMesh.rotation.y = Math.PI; // facing backward
    this.decalGroup.add(this.backTextMesh);

    // Render contents onto decal canvases
    this.updateDecals(config);
  }

  /**
   * Update decal canvas textures (chest logo, back name/number)
   */
  private async updateDecals(config: JerseyConfig) {
    // 1. Render Chest Badge
    const bctx = this.badgeCanvas.getContext('2d');
    if (bctx) {
      bctx.clearRect(0, 0, this.badgeCanvas.width, this.badgeCanvas.height);
      if (config.logoUrl) {
        try {
          const img = await loadLogoImage(config.logoUrl);
          if (img) {
            const aspect = (img.naturalWidth || 100) / (img.naturalHeight || 100);
            const maxDim = this.badgeCanvas.width - 24;
            let dw = maxDim;
            let dh = maxDim;
            if (aspect > 1) {
              dh = Math.round(maxDim / aspect);
            } else {
              dw = Math.round(maxDim * aspect);
            }
            const dx = (this.badgeCanvas.width - dw) / 2;
            const dy = (this.badgeCanvas.height - dh) / 2;
            bctx.drawImage(img, dx, dy, dw, dh);
            if (this.chestBadgeMesh) this.chestBadgeMesh.visible = true;
          }
        } catch {
          if (this.chestBadgeMesh) this.chestBadgeMesh.visible = false;
        }
      } else {
        if (this.chestBadgeMesh) this.chestBadgeMesh.visible = false;
      }
      this.badgeTexture.needsUpdate = true;
    }

    // 2. Render Back Name & Number
    const tctx = this.backTextCanvas.getContext('2d');
    if (tctx) {
      tctx.clearRect(0, 0, this.backTextCanvas.width, this.backTextCanvas.height);
      drawBackTextOverlay(tctx, this.backTextCanvas.width, this.backTextCanvas.height, {
        name: config.playerName,
        number: config.playerNumber,
        textColor: config.textColor,
        numberColor: config.numberColor,
        fontFamily: config.fontFamily,
        backNameStyle: config.backNameStyle || 'arched',
      });
      this.backTextTexture.needsUpdate = true;
    }
  }

  /**
   * Updates model state, materials, and decals
   */
  public async update(config: JerseyConfig): Promise<void> {
    // 1. Update procedural materials manager
    await this.materialManager.updateFromConfig(config);

    // 2. Determine target source & URL
    const targetSource = config.modelSource;
    const targetUrl = config.customGlbUrl || '/models/athletic_jersey.glb';

    if (targetSource === 'gltf' && targetUrl && targetUrl.trim()) {
      if (this.currentSource !== 'gltf' || this.currentGlbUrl !== targetUrl) {
        await this.loadExternalGlb(targetUrl, config);
      } else {
        // Model already loaded, update color, PBR and decals
        this.applyGltfMaterials(config);
        await this.updateDecals(config);
      }
    } else {
      // Procedural mode
      if (this.currentSource !== 'procedural') {
        if (this.gltfGroup) this.gltfGroup.visible = false;
        this.decalGroup.visible = false;
        this.proceduralGroup.visible = true;
        this.currentSource = 'procedural';
      }
    }
  }

  public dispose() {
    this.materialManager.dispose();
    this.badgeTexture.dispose();
    this.backTextTexture.dispose();

    while (this.proceduralGroup.children.length > 0) {
      const child = this.proceduralGroup.children[0];
      this.proceduralGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    while (this.decalGroup.children.length > 0) {
      const child = this.decalGroup.children[0];
      this.decalGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    if (this.gltfGroup) {
      this.group.remove(this.gltfGroup);
    }
  }
}

