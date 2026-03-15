interface CustomGradientBarProps extends React.SVGProps<SVGRectElement> {
  dataKey?: string;
  showLabel?: boolean;
  value?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const CustomGradientBar = (props: CustomGradientBarProps) => {
  const { fill, x, y, width, height, dataKey, showLabel, value } = props;
  const numX = Number(x);
  const numY = Number(y);
  const numW = Number(width);
  const numH = Number(height);
  const cx = numX + numW / 2;
  const cy = numY + numH / 2;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#gradient-bar-pattern-${dataKey})`}
      />
      <rect x={x} y={y} width={width} height={2} stroke="none" fill={fill} />
      {showLabel && value != null && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(-90, ${cx}, ${cy})`}
          fill="#a1a1aa"
          fontSize="10px"
          fontFamily="var(--font-mono)"
        >
          {value}
        </text>
      )}
      <defs>
        <linearGradient id={`gradient-bar-pattern-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};

export default CustomGradientBar;
