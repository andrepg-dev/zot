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
    <div className="flex flex-col gap-3 sm:gap-4 px-2">
      <div className="flex justify-center font-mono tracking-wider text-xs sm:text-sm">
        {subtitle}
      </div>

      <div className="flex flex-col text-center gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-center gap-2">
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

        <div className="flex justify-center px-2">
          <span className={cn("text-muted-foreground text-center max-w-[40ch] flex justify-center text-sm sm:text-base lg:text-lg", classNames?.description)}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
