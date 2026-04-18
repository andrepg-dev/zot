import * as Babel from "@babel/core";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as ReactEmail from "@react-email/components";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as vm from "vm";

const DOCTYPE =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

/**
 * Servicio para compilar código React (pensado para plantillas de @react-email/components)
 * a HTML plano de forma segura.
 *
 * Flujo:
 * 1. `compileComponent(code)` transpila el JSX con Babel y lo evalúa en un sandbox `vm`
 *    una sola vez, devolviendo el componente React listo para renderizar.
 * 2. `renderComponent(Component, variables)` invoca el componente con las props dadas
 *    y devuelve el HTML. Se puede llamar N veces con variables distintas sin re-transpilar.
 * 3. `compile(code, variables?)` es un atajo que hace ambas cosas en una sola llamada.
 *
 * El patrón recomendado para las plantillas es:
 *   const Email = ({ recipientName = "there", ... } = {}) => (...)
 * Así el componente siempre tiene defaults y nunca explota si faltan props.
 */
@Injectable()
export class ReactToHtmlService {
  private readonly logger = new Logger(ReactToHtmlService.name);

  private readonly componentNames = Object.keys(ReactEmail)
    .filter((key) => key !== "default")
    .join(", ");

  compileComponent(code: string): React.ComponentType<Record<string, unknown>> {
    this.validateCode(code);

    const transpiled = Babel.transformSync(code, {
      presets: ["@babel/preset-react"],
    });

    if (!transpiled?.code) {
      throw new BadRequestException("Transpilation failed");
    }

    const sandbox = {
      React,
      Components: ReactEmail,
      exports: {} as { default?: React.ComponentType<Record<string, unknown>> },
    };

    vm.createContext(sandbox);

    const wrappedCode = `
      const { ${this.componentNames} } = Components;
      ${transpiled.code}
      exports.default = typeof Email !== "undefined" ? Email : (typeof Default !== "undefined" ? Default : null);
    `;

    try {
      vm.runInContext(wrappedCode, sandbox, {
        timeout: 3000,
        displayErrors: true,
      });
    } catch (error) {
      throw new BadRequestException(`Invalid email code: ${(error as Error).message}`);
    }

    const Component = sandbox.exports.default;
    if (!Component) {
      throw new BadRequestException("No email component found. Export as Email or Default.");
    }

    return Component;
  }

  async renderComponent(
    Component: React.ComponentType<Record<string, unknown>>,
    variables: Record<string, unknown> = {},
  ): Promise<string> {
    try {
      const html = renderToStaticMarkup(React.createElement(Component, variables));
      return `${DOCTYPE}${html.replace(/<!DOCTYPE.*?>/, "")}`;
    } catch (error) {
      this.logger.warn(`Failed to render email component: ${(error as Error).message}`);
      throw new BadRequestException(`Render failed: ${(error as Error).message}`);
    }
  }

  async compile(code: string, variables: Record<string, unknown> = {}): Promise<string> {
    const Component = this.compileComponent(code);
    return this.renderComponent(Component, variables);
  }

  private validateCode(code: string): void {
    const dangerousPatterns = [
      /process\./gi,
      /require\s*\(/gi,
      /import\s*\(/gi,
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /globalThis/gi,
      /global\./gi,
      /__proto__/gi,
      /constructor\s*\[/gi,
      /child_process/gi,
      /fs\./gi,
      /\bexec\s*\(/gi,
      /\bspawn\s*\(/gi,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new BadRequestException("Code not allowed.");
      }
    }
  }
}
