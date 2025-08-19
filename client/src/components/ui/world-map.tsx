"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  points?: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
}


export function WorldMap({
  dots = [],
  points = [],
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const [svgMap, setSvgMap] = useState<string>("");
  
  const { theme } = useTheme();
  
  // Only run on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    
    const generatedSvgMap = map.getSVG({
      radius: 0.22,
      color: theme === "dark" ? "#FFFFFF80" : "#00000080",
      shape: "circle",
      backgroundColor: theme === "dark" ? "#000000" : "#FFFFFF",
    });
    
    setSvgMap(generatedSvgMap);
  }, [theme]);

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Generate coordinate grid lines
  const generateGridLines = () => {
    if (!mounted) return [];
    
    const lines = [];
    
    // Longitude lines (vertical)
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = (lng + 180) * (800 / 360);
      lines.push(
        <line 
          key={`lng-${lng}`}
          x1={x} 
          y1={0} 
          x2={x} 
          y2={400} 
          stroke={theme === "dark" ? "#FFFFFF20" : "#00000020"} 
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      );
    }
    
    // Latitude lines (horizontal)
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = (90 - lat) * (400 / 180);
      lines.push(
        <line 
          key={`lat-${lat}`} 
          x1={0} 
          y1={y} 
          x2={800} 
          y2={y} 
          stroke={theme === "dark" ? "#FFFFFF20" : "#00000020"} 
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      );
    }
    
    return lines;
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse bg-muted/20 w-full h-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden">
      {svgMap && (
        <div className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none">
          {/* Using div with background image instead of Image component for SVG data URLs */}
          <div 
            className="h-full w-full bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(data:image/svg+xml;utf8,${encodeURIComponent(svgMap)})` }}
            aria-label="world map"
          />
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {/* Coordinate grid lines */}
        {generateGridLines()}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke={theme === "dark" ? "#FFFFFF" : "#000000"}
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme === "dark" ? "#FFFFFF" : "#000000"} stopOpacity="0" />
            <stop offset="5%" stopColor={theme === "dark" ? "#FFFFFF" : "#000000"} stopOpacity="1" />
            <stop offset="95%" stopColor={theme === "dark" ? "#FFFFFF" : "#000000"} stopOpacity="1" />
            <stop offset="100%" stopColor={theme === "dark" ? "#FFFFFF" : "#000000"} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Connection dots with paths */}
        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
              {dot.start.label && (
                <text
                  x={projectPoint(dot.start.lat, dot.start.lng).x + 5}
                  y={projectPoint(dot.start.lat, dot.start.lng).y - 5}
                  fontSize="8"
                  fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                  textAnchor="start"
                >
                  {dot.start.label}
                </text>
              )}
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
              {dot.end.label && (
                <text
                  x={projectPoint(dot.end.lat, dot.end.lng).x + 5}
                  y={projectPoint(dot.end.lat, dot.end.lng).y - 5}
                  fontSize="8"
                  fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                  textAnchor="start"
                >
                  {dot.end.label}
                </text>
              )}
            </g>
          </g>
        ))}
        
        {/* Individual points */}
        {points.map((point, i) => (
          <g key={`single-point-${i}`}>
            <circle
              cx={projectPoint(point.lat, point.lng).x}
              cy={projectPoint(point.lat, point.lng).y}
              r="2"
              fill={theme === "dark" ? "#FFFFFF" : "#000000"}
            />
            <circle
              cx={projectPoint(point.lat, point.lng).x}
              cy={projectPoint(point.lat, point.lng).y}
              r="2"
              fill={theme === "dark" ? "#FFFFFF" : "#000000"}
              opacity="0.5"
            >
              <animate
                attributeName="r"
                from="2"
                to="8"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
            {point.label && (
              <text
                x={projectPoint(point.lat, point.lng).x + 5}
                y={projectPoint(point.lat, point.lng).y - 5}
                fontSize="8"
                fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                textAnchor="start"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
