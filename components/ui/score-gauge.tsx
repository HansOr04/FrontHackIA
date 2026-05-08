import { scoreColor } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 128 }: ScoreGaugeProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const color = scoreColor(score);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ display: "block" }}
    >
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#1e293b"
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="60"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
      >
        {score}
      </text>
      <text
        x="60"
        y="74"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#94a3b8"
        fontSize="10"
      >
        Score
      </text>
    </svg>
  );
}
