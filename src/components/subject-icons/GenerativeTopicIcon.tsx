import React, { useMemo } from 'react';
import { motion } from 'motion/react';

// Hash function to get a deterministic number from a string
const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function rand(hash: number, min: number, max: number, offset: number) {
  const v = ((hash >>> offset) & 0xFF) / 255;
  return min + v * (max - min);
}

export function GenerativeTopicIcon({ topic, ...props }: { topic: string } & React.SVGProps<SVGSVGElement>) {
  const params = useMemo(() => {
    const h = cyrb53(topic);
    
    // Core animation parameters
    const dur1 = rand(h, 2.5, 6.5, 0);
    const dur2 = rand(h, 3.5, 8.5, 4);
    const dur3 = rand(h, 1.5, 4.5, 8);
    const rotDir = (h & 1) ? 1 : -1;
    
    // Core structural parameters
    const baseType = h % 6; 
    
    // Random metrics for shapes
    const r1 = rand(h, 1, 5, 12);
    const cx1 = rand(h, 6, 16, 16);
    const cy1 = Math.floor(rand(h, 6, 16, 20));
    
    const r2 = rand(h, 1.5, 4, 24);
    const cx2 = Math.floor(rand(h, 4, 18, 28));
    
    return { h, dur1, dur2, dur3, rotDir, baseType, r1, cx1, cy1, r2, cx2 };
  }, [topic]);

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {params.baseType === 0 && (
        <g>
          <motion.circle cx="12" cy="12" r={params.r1} animate={{ scale: [1, 1 + params.r2/10, 1] }} transition={{ repeat: Infinity, duration: params.dur1 }} />
          <motion.g animate={{ rotate: 360 * params.rotDir }} transition={{ repeat: Infinity, duration: params.dur2, ease: "linear" }} style={{ originX: "12px", originY: "12px" }}>
            <ellipse cx="12" cy="12" rx={params.cx1} ry={params.cy1 / 2} opacity={0.4} />
            <circle cx={12 + params.cx1} cy="12" r={params.r2} fill="currentColor" />
          </motion.g>
        </g>
      )}
      
      {params.baseType === 1 && (
        <g>
          <motion.polygon 
             points={`12,${params.cy1/2} ${24-params.cx1},${24-params.cy1/2} ${params.cx1},${24-params.cy1/2}`} 
             animate={{ rotate: [0, 90 * params.rotDir, 180 * params.rotDir], scale: [1, 0.8, 1] }} 
             transition={{ repeat: Infinity, duration: params.dur2, ease: "easeInOut" }} 
             style={{ originX: "12px", originY: "12px" }}
          />
          <motion.polygon 
             points={`12,${24-params.cy1/2} ${24-params.cx1},${params.cy1/2} ${params.cx1},${params.cy1/2}`} 
             animate={{ rotate: [0, -90 * params.rotDir, -180 * params.rotDir], scale: [0.8, 1, 0.8] }} 
             transition={{ repeat: Infinity, duration: params.dur2, ease: "easeInOut" }} 
             style={{ originX: "12px", originY: "12px" }}
          />
        </g>
      )}

      {params.baseType === 2 && (
        <g>
          <motion.path 
             d={`M2,${params.cy1} Q8,${params.cy1 - params.r1 * 2} 12,${params.cy1} T22,${params.cy1}`}
             animate={{ d: [
               `M2,${params.cy1} Q8,${params.cy1 - params.r1 * 2} 12,${params.cy1} T22,${params.cy1}`,
               `M2,${params.cy1} Q8,${params.cy1 + params.r1 * 2} 12,${params.cy1} T22,${params.cy1}`,
               `M2,${params.cy1} Q8,${params.cy1 - params.r1 * 2} 12,${params.cy1} T22,${params.cy1}`
             ] }} 
             transition={{ repeat: Infinity, duration: params.dur1, ease: "easeInOut" }} 
          />
          <motion.circle cx="12" cy={params.cy1} r={params.r2} fill="currentColor" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: params.dur1/2 }} />
        </g>
      )}

      {params.baseType === 3 && (
        <g>
          <motion.rect x={params.cx1/2} y={params.cy1/2} width={24-params.cx1} height={params.r1*2} animate={{ x: [0, params.r2, 0] }} transition={{ repeat: Infinity, duration: params.dur1 }} />
          <motion.rect x={params.cx2/2} y={params.cy1} width={24-params.cx2} height={params.r2*2} animate={{ x: [0, -params.r1, 0] }} transition={{ repeat: Infinity, duration: params.dur2 }} />
          <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" opacity={0.5} />
        </g>
      )}

      {params.baseType === 4 && (
        <g>
          <motion.path 
             d={`M${params.cx1},${params.cy1} L${24-params.cx1},${24-params.cy1} L${params.cy1},${params.cx1} Z`} 
             animate={{ opacity: [0.3, 0.7, 0.3] }} 
             transition={{ repeat: Infinity, duration: params.dur1 }} 
          />
          <motion.circle cx={params.cx1} cy={params.cy1} r={params.r2} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: params.dur1 }} />
          <motion.circle cx={24-params.cx1} cy={24-params.cy1} r={params.r1} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: params.dur2 }} />
          <motion.circle cx={params.cy1} cy={params.cx1} r={params.r2} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: params.dur3 }} />
        </g>
      )}

      {params.baseType === 5 && (
        <g>
          <motion.path 
             d={`M12,2 C${params.cx1},2 ${22},${params.cy1} 12,22 C${params.cx2},22 2,${params.cy1} 12,2`} 
             animate={{ 
               d: [
                 `M12,2 C${params.cx1},2 ${22},${params.cy1} 12,22 C${params.cx2},22 2,${params.cy1} 12,2`,
                 `M12,4 C${params.cx2},4 ${20},${24-params.cy1} 12,20 C${params.cx1},20 4,${24-params.cy1} 12,4`,
                 `M12,2 C${params.cx1},2 ${22},${params.cy1} 12,22 C${params.cx2},22 2,${params.cy1} 12,2`
               ]
             }} 
             transition={{ repeat: Infinity, duration: params.dur2, ease: "easeInOut" }} 
          />
          <motion.circle cx="12" cy="12" r={params.r2} fill="currentColor" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: params.dur1 }} />
        </g>
      )}
    </svg>
  );
}
