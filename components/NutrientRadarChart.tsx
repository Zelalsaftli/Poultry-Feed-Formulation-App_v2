import React, { useState, useMemo } from 'react';

interface ChartData {
  label: string;
  value: number;
  min: number;
  max: number;
}

interface NutrientRadarChartProps {
  data: ChartData[];
  size?: number;
}

const NutrientRadarChart: React.FC<NutrientRadarChartProps> = ({ data, size = 400 }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const center = size / 2;
    const radius = center * 0.8;
    const angleSlice = (Math.PI * 2) / data.length;

    const scale = data.map(item => {
      const isMinOnly = item.max === Infinity;
      const range = isMinOnly ? item.min * 0.5 : item.max - item.min;
      const overallMin = Math.max(0, item.min - range * 0.25);
      const overallMax = isMinOnly ? Math.max(item.value, item.min) * 1.25 : Math.max(item.value, item.max) + range * 0.25;
      return { overallMin, overallMax };
    });

    const normalize = (value: number, index: number) => {
      const { overallMin, overallMax } = scale[index];
      if (overallMax === overallMin) return 0;
      return (value - overallMin) / (overallMax - overallMin);
    };

    const points = data.map((item, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const valueRatio = Math.max(0, Math.min(1, normalize(item.value, i)));
      const minRatio = Math.max(0, Math.min(1, normalize(item.min, i)));
      const maxRatio = item.max === Infinity ? 1 : Math.max(0, Math.min(1, normalize(item.max, i)));
      
      return {
        value: {
          x: center + radius * valueRatio * Math.cos(angle),
          y: center + radius * valueRatio * Math.sin(angle),
        },
        min: {
          x: center + radius * minRatio * Math.cos(angle),
          y: center + radius * minRatio * Math.sin(angle),
        },
        max: {
          x: center + radius * maxRatio * Math.cos(angle),
          y: center + radius * maxRatio * Math.sin(angle),
        },
        axis: {
          x: center + radius * Math.cos(angle),
          y: center + radius * Math.sin(angle),
        },
        label: {
          x: center + (radius + 20) * Math.cos(angle),
          y: center + (radius + 20) * Math.sin(angle),
        },
      };
    });

    const getPolygonString = (key: 'value' | 'min' | 'max') => points.map(p => `${p[key].x},${p[key].y}`).join(' ');

    return { center, radius, points, getPolygonString };
  }, [data, size]);

  if (!chartData) {
    return <div className="text-center text-gray-500">Not enough data to display the chart.</div>;
  }

  const { center, radius, points, getPolygonString } = chartData;
  
  const handleMouseOver = (e: React.MouseEvent, item: ChartData, point: {x: number, y: number}) => {
    const content = `${item.label}: ${item.value.toFixed(2)} (Range: ${item.min}-${item.max === Infinity ? '∞' : item.max})`;
    setTooltip({ x: point.x, y: point.y, content });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g>
          {[0.25, 0.5, 0.75, 1].map(r => (
            <circle
              key={r}
              cx={center}
              cy={center}
              r={radius * r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
        </g>
        <g>
          {points.map((p, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.axis.x}
              y2={p.axis.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
        </g>
        <g>
          {points.map((p, i) => (
            <text
              key={i}
              x={p.label.x}
              y={p.label.y}
              dy="0.35em"
              textAnchor={p.label.x > center ? "start" : "end"}
              fontSize="12"
              fill="#4b5563"
              fontWeight="bold"
            >
              {data[i].label}
            </text>
          ))}
        </g>
        
        {/* Recommended range area */}
        <polygon points={getPolygonString('max')} fill="rgba(52, 211, 153, 0.2)" />
        <polygon points={getPolygonString('min')} fill="white" />
        <polygon points={getPolygonString('min')} fill="rgba(52, 211, 153, 0.2)" stroke="#10b981" strokeWidth="1" />

        {/* Actual value line */}
        <polygon
          points={getPolygonString('value')}
          fill="rgba(59, 130, 246, 0.25)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        <g>
            {points.map((p, i) => (
                <circle
                    key={i}
                    cx={p.value.x}
                    cy={p.value.y}
                    r="4"
                    fill="#3b82f6"
                    onMouseOver={(e) => handleMouseOver(e, data[i], p.value)}
                    onMouseOut={handleMouseOut}
                    className="cursor-pointer"
                />
            ))}
        </g>
      </svg>
      {tooltip && (
        <div
          className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none shadow-lg"
          style={{ top: tooltip.y - 30, left: tooltip.x, transform: 'translateX(-50%)' }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default NutrientRadarChart;