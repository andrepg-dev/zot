import GradientText from "@/components/GradientText";
import { cn } from "@/lib/utils";

export interface LandingPageTitleProps {
  /** Etiqueta pequeña sobre el título (ej. "Productivity insights") */
  subtitle: string;
  /** Parte antes y parte con gradiente del título */
  title: { before: string; gradient: string };
  /** Colores y velocidad de animación del gradiente */
  gradient: { colors: [string, string]; animationSpeed?: number };
  /** Descripción debajo del título */
  description: string;

  classNames?: {
    description: string
  }
}

export default function LandingPageTitle({
  subtitle,
  title,
  gradient,
  description,
  classNames
}: LandingPageTitleProps) {
  const { colors, animationSpeed = 16 } = gradient;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center font-mono tracking-wider text-sm">
        {subtitle}
      </div>

      <div className="flex flex-col text-center gap-4">
        <div className="flex items-center justify-center text-5xl font-light leading-tight text-center gap-2">
          <span>{title.before}</span>
          <GradientText
            colors={colors}
            animationSpeed={animationSpeed}
            showBorder={false}
            className="font-light! text-center"
          >
            {title.gradient}
          </GradientText>
        </div>

        <div className="flex justify-center">
          <span className={cn("text-muted-foreground text-center max-w-[40ch] flex justify-center text-lg", classNames?.description)}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
