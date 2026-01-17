'use client'
import React from 'react'
import { X, Box, Move, RotateCcw } from 'lucide-react'

const ARViewer = ({ modelSrc, onClose, productName }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl aspect-square md:aspect-video bg-[#1e293b] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg text-white">
                            <Box size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{productName || '3D Product View'}</h3>
                            <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">Augmented Reality Ready</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Model Viewer Container */}
                <div className="flex-1 relative group">
                    <model-viewer
                        src={modelSrc || "https://modelviewer.dev/shared-assets/models/Astronaut.glb"}
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls
                        poster="poster.webp"
                        shadow-intensity="1"
                        auto-rotate
                        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                    >
                        <button slot="ar-button" className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                            <Move size={18} />
                            View in your space
                        </button>
                    </model-viewer>

                    {/* Interaction Guide */}
                    <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                            <RotateCcw size={12} />
                            Drag to rotate
                        </div>
                    </div>
                </div>

                {/* Footer / Controls Hint */}
                <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm">
                        Compatible with Android (Scene Viewer) and iOS (Quick Look) for AR experiences.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ARViewer
