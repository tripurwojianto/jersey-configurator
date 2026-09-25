import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Hand, Move, Info, Download, CheckCircle2, Loader2, Box } from 'lucide-react';
import { JerseyConfig } from '../types/design';
import { JerseyMaterialManager } from './JerseyMaterial';
import { JerseyModel } from './JerseyModel';
import { APPAREL_MODELS } from '../data/models';

export interface JerseyViewerHandle {
  exportCurrentJerseyGLB: () => Promise<void>;
  isExporting: boolean;
}

interface JerseyViewerProps {
  config: JerseyConfig;
  className?: string;
  onExportStatusChange?: (isExporting: boolean) => void;
  /** Controls visibility of the floating GLB export button in the viewport. Defaults to false for public configurator. */
  showDownloadGlbButton?: boolean;
}

export const JerseyViewer = forwardRef<JerseyViewerHandle, JerseyViewerProps>(({
  config,
  className = '',
  onExportStatusChange,
  showDownloadGlbButton = false,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const jerseyModelRef = useRef<JerseyModel | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isPanMode, setIsPanMode] = useState(false);
  const [currentView, setCurrentView] = useState<'front' | 'back' | 'left' | 'right' | 'free'>('front');
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentModelInfo = APPAREL_MODELS.find(
    (m) =>
      (config.productId && m.productId === config.productId) ||
      (config.modelId && (m.id === config.modelId || m.productId === config.modelId)) ||
      (config.customGlbUrl && m.glbUrl === config.customGlbUrl) ||
      (config.modelSource === 'gltf' && m.sourceType === 'gltf') ||
      (config.modelSource === 'procedural' && m.sourceType === 'procedural')
  ) || APPAREL_MODELS[0];

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 4.6);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and color management
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. OrbitControls with Rotate & Zoom (Pan disabled so model rotates on its own vertical axis)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    // Set polar angle limits to prevent flipping or seeing under floor while allowing natural vertical orbit
    controls.minPolarAngle = Math.PI * 0.25; // ~45 deg
    controls.maxPolarAngle = Math.PI * 0.60; // ~108 deg
    controls.target.set(0, 0, 0); // Exact geometric center of jersey
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false; // Permanently disabled so jersey stays fixed in place
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN, // When enablePan = false, OrbitControls treats TWO fingers strictly as DOLLY (pinch-zoom)
    };
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Key Light (Front Right, high)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Front Left, lower)
    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.0);
    fillLight.position.set(-3.5, 2, 2.5);
    scene.add(fillLight);

    // Rim / Back Light (creates clean edge highlight on jersey)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Bottom bounce light (softens underneath)
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.4);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 6. Ground Studio Shadow Disc (Soft contact shadow for light studio floor)
    const groundGeo = new THREE.PlaneGeometry(6, 6);
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 256;
    groundCanvas.height = 256;
    const gctx = groundCanvas.getContext('2d');
    if (gctx) {
      const grad = gctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
      grad.addColorStop(0.4, 'rgba(15, 23, 42, 0.08)');
      grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.02)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 256, 256);
    }
    const groundTex = new THREE.CanvasTexture(groundCanvas);
    const groundMat = new THREE.MeshBasicMaterial({
      map: groundTex,
      transparent: true,
      depthWrite: false,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.35;
    scene.add(groundMesh);

    // 7. Initialize Jersey Model
    const materialManager = new JerseyMaterialManager();
    const jerseyModel = new JerseyModel(materialManager);
    scene.add(jerseyModel.group);
    jerseyModelRef.current = jerseyModel;

    // Apply initial config
    setIsLoadingModel(true);
    jerseyModel
      .update(config)
      .catch((err) => {
        console.warn('Model update error:', err);
      })
      .finally(() => {
        setIsLoadingModel(false);
        if (jerseyModel.loadError) {
          setLoadError(jerseyModel.loadError);
        }
      });

    // 8. Animation Loop
    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer (debounced with requestAnimationFrame)
    let resizeRafId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      resizeRafId = requestAnimationFrame(() => {
        if (!isMounted) return;
        for (const entry of entries) {
          const { width: newW, height: newH } = entry.contentRect;
          if (newW > 0 && newH > 0) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
          }
        }
      });
    });
    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      resizeObserver.disconnect();
      controls.dispose();
      jerseyModel.dispose();
      renderer.dispose();
      groundTex.dispose();
      groundGeo.dispose();
      groundMat.dispose();
    };
  }, []); // Run once on mount

  // Update model when config changes
  useEffect(() => {
    if (jerseyModelRef.current) {
      const prevSource = jerseyModelRef.current.currentSource;
      const prevUrl = jerseyModelRef.current.currentGlbUrl;
      const willLoadNewAsset =
        config.modelSource === 'gltf' &&
        (prevSource !== 'gltf' || (config.customGlbUrl || '/models/athletic_jersey.glb') !== prevUrl);

      if (willLoadNewAsset) {
        setIsLoadingModel(true);
      }

      jerseyModelRef.current
        .update(config)
        .then(() => {
          setLoadError(jerseyModelRef.current?.loadError || null);
        })
        .finally(() => {
          if (willLoadNewAsset) {
            setIsLoadingModel(false);
          }
        });
    }
  }, [config]);

  // Sync auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [isAutoRotate]);

  // Sync pan mode
  // Enforce rotation around model center without horizontal panning
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enablePan = false;
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [isPanMode]);

  // Camera preset transitions
  const setCameraAngle = useCallback((view: 'front' | 'back' | 'left' | 'right') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    setIsAutoRotate(false);
    setCurrentView(view);

    const distance = 4.6;
    const y = 0.05;

    switch (view) {
      case 'front':
        camera.position.set(0, y, distance);
        break;
      case 'back':
        camera.position.set(0, y, -distance);
        break;
      case 'left':
        camera.position.set(-distance, y, 0);
        break;
      case 'right':
        camera.position.set(distance, y, 0);
        break;
    }

    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  const resetCamera = useCallback(() => {
    setCameraAngle('front');
  }, [setCameraAngle]);

  const zoomIn = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, 0.5);
    controlsRef.current.update();
  }, []);

  const zoomOut = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -0.5);
    controlsRef.current.update();
  }, []);

  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<{ message: string; isError?: boolean } | null>(null);

  /**
   * Exports the current 3D jersey model with all dynamic canvas textures
   * (colors, patterns, player name 'DIGID', number '10', and badge) baked permanently into a .GLB file.
   */
  const exportCurrentJerseyGLB = useCallback(async () => {
    if (!jerseyModelRef.current) {
      console.warn('Jersey model is not ready for export yet');
      return;
    }

    setIsExporting(true);
    if (onExportStatusChange) onExportStatusChange(true);
    setExportNotice({ message: 'Menyiapkan tekstur & geometri 3D...' });

    try {
      const jerseyModel = jerseyModelRef.current;

      // 1. Ensure latest dynamic canvas textures (typography, number, colors, pattern, crest) are freshly drawn
      await jerseyModel.materialManager.updateFromConfig(config);

      // 2. Get active 3D object from the model
      const exportObject = jerseyModel.getExportObject();

      setExportNotice({ message: 'Membake tekstur & menyusun file GLB...' });

      // 3. Initialize GLTFExporter with binary (.glb) mode
      const exporter = new GLTFExporter();
      const options: GLTFExporterOptions = {
        binary: true,
        onlyVisible: true,
        maxTextureSize: 2048,
        embedImages: true,
      };

      const glbData = await exporter.parseAsync(exportObject, options);

      // 4. Create Blob and trigger auto-download
      const blob = new Blob([glbData as ArrayBuffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Safe filename: defaults to digid-custom-jersey.glb
      const safeName = (config.playerName || 'digid')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/gi, '-');
      const filename = `${safeName || 'digid'}-custom-jersey.glb`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 2000);

      setExportNotice({ message: `Model 3D berhasil diunduh: ${filename}` });
      setTimeout(() => setExportNotice(null), 4500);
    } catch (error) {
      console.error('Failed to export jersey GLB:', error);
      setExportNotice({ message: 'Gagal mengekspor file GLB. Silakan coba lagi.', isError: true });
      setTimeout(() => setExportNotice(null), 4500);
    } finally {
      setIsExporting(false);
      if (onExportStatusChange) onExportStatusChange(false);
    }
  }, [config, onExportStatusChange]);

  useImperativeHandle(
    ref,
    () => ({
      exportCurrentJerseyGLB,
      isExporting,
    }),
    [exportCurrentJerseyGLB, isExporting]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-0 overflow-hidden select-none bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] ${className}`}
      id="jersey-3d-viewport"
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${isPanMode ? 'cursor-move' : 'cursor-grab active:cursor-grabbing'} outline-none`}
      />

      {/* Top Left: Active 3D Model Info Badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1 z-10 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-slate-700 shadow-xs sm:shadow-sm">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="font-bold text-slate-900 hidden sm:inline">{currentModelInfo.name}</span>
          <span className="font-bold text-slate-900 sm:hidden">{currentModelInfo.shortName}</span>
          <span className="text-slate-300">•</span>
          <span className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded border ${currentModelInfo.badgeColor}`}>
            {currentModelInfo.badge}
          </span>
        </div>

        {loadError && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-md shadow-xs max-w-[260px] sm:max-w-sm">
            <Info className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{loadError}</span>
          </div>
        )}
      </div>

      {/* Top Right: Camera Angle Quick-Select */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 flex items-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg p-0.5 sm:p-1 shadow-xs sm:shadow-sm z-10">
        <button
          id="btn-view-front"
          onClick={() => setCameraAngle('front')}
          className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all ${
            currentView === 'front'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Front View (Chest & Crest)"
        >
          Front
        </button>
        <button
          id="btn-view-back"
          onClick={() => setCameraAngle('back')}
          className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all ${
            currentView === 'back'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Back View (Name & Number)"
        >
          Back
        </button>
        <button
          id="btn-view-left"
          onClick={() => setCameraAngle('left')}
          className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all ${
            currentView === 'left'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Left Sleeve"
        >
          Left
        </button>
        <button
          id="btn-view-right"
          onClick={() => setCameraAngle('right')}
          className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all ${
            currentView === 'right'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Right Sleeve"
        >
          Right
        </button>
      </div>

      {/* Bottom Center: Interaction HUD with Rotate & Zoom hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-full px-4 py-1.5 text-[11px] text-slate-500 z-10">
        <span className="flex items-center gap-1.5 font-medium">
          <RotateCw className="w-3 h-3 text-slate-400" />
          <span>Drag to rotate around model</span>
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <ZoomIn className="w-3 h-3 text-slate-400" />
          <span>Scroll or pinch to zoom</span>
        </span>
      </div>

      {/* Floating Camera Controls Toolbar (Right side) */}
      <div className="absolute right-2.5 bottom-2.5 sm:right-4 sm:bottom-4 flex flex-col gap-1 sm:gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg p-0.5 sm:p-1 shadow-md z-10">
        <button
          id="btn-reset-camera"
          onClick={resetCamera}
          className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Reset Camera Position"
          aria-label="Reset Camera"
        >
          <RefreshCw className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>

        {/* Pan Mode Toggle */}
        <button
          id="btn-toggle-pan"
          onClick={() => setIsPanMode((prev) => !prev)}
          className={`p-1.5 sm:p-2 rounded-md transition-colors ${
            isPanMode
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={isPanMode ? 'Pan Mode Active (Drag to Pan)' : 'Switch Left-Click to Pan Mode'}
          aria-label="Toggle Pan Mode"
        >
          <Move className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>

        {/* Auto-Rotate Turntable */}
        <button
          id="btn-auto-rotate"
          onClick={() => setIsAutoRotate((prev) => !prev)}
          className={`p-1.5 sm:p-2 rounded-md transition-colors ${
            isAutoRotate
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Toggle 3D Auto-Rotate Turntable"
          aria-label="Toggle Auto Rotate"
        >
          <RotateCw className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isAutoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Zoom In */}
        <button
          id="btn-zoom-in"
          onClick={zoomIn}
          className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>

        {/* Zoom Out */}
        <button
          id="btn-zoom-out"
          onClick={zoomOut}
          className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>
      </div>

      {/* Floating GLB Export Button (Direct Download from 3D Viewport - Hidden for public viewers) */}
      {showDownloadGlbButton && (
        <div className="absolute left-2.5 bottom-2.5 sm:left-4 sm:bottom-4 z-10 pointer-events-auto">
          <button
            id="btn-export-viewer-glb"
            onClick={exportCurrentJerseyGLB}
            disabled={isExporting}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 active:scale-95 text-white backdrop-blur-md rounded-lg text-xs font-semibold shadow-md transition-all border border-slate-700/60 disabled:opacity-60 cursor-pointer"
            title="Download 3D Model (.GLB) dengan tekstur warna, pola, nama & nomor"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="hidden sm:inline">Mengekspor 3D (.GLB)...</span>
                <span className="sm:hidden">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Download 3D Model (.GLB)</span>
                <span className="sm:hidden">Download .GLB</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Export Status Notification Toast */}
      {exportNotice && (
        <div
          className={`absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-lg border transition-all pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200 ${
            exportNotice.isError
              ? 'bg-rose-950/95 text-rose-200 border-rose-800'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {exportNotice.isError ? (
            <Info className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          )}
          <span className="truncate max-w-[280px] sm:max-w-md">{exportNotice.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoadingModel && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-slate-700 z-20">
          <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-800">
            Loading 3D Jersey Asset...
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentModelInfo.fileSize || 'Processing'}</p>
        </div>
      )}
    </div>
  );
});

JerseyViewer.displayName = 'JerseyViewer';

