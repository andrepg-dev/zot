import * as Babel from "@babel/core";
import { Injectable } from "@nestjs/common";
import * as ReactEmail from "@react-email/components";
import { render } from "@react-email/render";
import React from "react";
import * as vm from "vm";

/**
 * Servicio para compilar código React (pensado para plantillas de @react-email/components)
 * a HTML plano de forma segura.
 *
 * Uso:
 * - Recibe una cadena de texto con código React (JSX) en el parámetro `code`.
 * - El código debe definir un componente llamado `EmailComponent` o `Default`.
 * - Los componentes de `@react-email/components` están disponibles vía objeto `Components`
 *   (no se deben usar imports dentro del string).
 *
 * Seguridad:
 * - Antes de ejecutar el código se valida que no contenga patrones peligrosos
 *   (process, require, import dinámico, eval, child_process, fs, etc.).
 * - El código se ejecuta en un sandbox de Node `vm` con timeout para evitar bloqueos.
 *
 * Ejemplo de código válido:
 * const EmailComponent = () => (
 *   <Html>
 *     <Body>
 *       <Text>Hola desde mi email</Text>
 *     </Body>
 *   </Html>
 * );
 *
 * La respuesta del método `compile` es una cadena con el HTML renderizado listo
 * para usarse, por ejemplo, en un email o en un iframe mediante `srcDoc`.
 */
@Injectable()
export class ReactToHtmlService {
  async compile(code: string): Promise<string> {
    this.validateCode(code);

    const transpiled = Babel.transformSync(code, {
      presets: ["@babel/preset-react"],
    });

    if (!transpiled?.code) {
      throw new Error("Transpilation failed");
    }

    const sandbox = {
      React,
      Components: ReactEmail,
      exports: {} as { default?: React.ComponentType },
    };

    vm.createContext(sandbox);

    const componentNames = Object.keys(ReactEmail)
      .filter((key) => key !== "default")
      .join(", ");

    const wrappedCode = `
    const { ${componentNames} } = Components;
    ${transpiled?.code}
    exports.default = typeof Email !== "undefined" ? Email : (typeof Default !== 'undefined' ? Default : null);
  `;

    vm.runInContext(wrappedCode, sandbox, {
      timeout: 3000,
      displayErrors: true,
    });

    const EmailComponent = sandbox.exports.default;

    if (!EmailComponent) {
      throw new Error("No email component found. Export as Email or Default");
    }

    const html = await render(React.createElement(EmailComponent));
    return html;
  }

  private validateCode(code: string): void {
    // Lista de patrones peligrosos
    const dangerousPatterns = [
      /process\./gi,
      /require\s*\(/gi,
      /import\s*\(/gi, // dynamic imports
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
        throw new Error(`Code not allowed.`);
      }
    }
  }
}
