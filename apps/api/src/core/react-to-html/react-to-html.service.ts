import * as Babel from "@babel/core";
import { Injectable } from "@nestjs/common";
import * as ReactEmail from "@react-email/components";
import { render } from "@react-email/render";
import React from "react";
import * as vm from "vm";

// Tengo que validar que no se añada código que pueda acceder a mi código fuente principal, porque sería una catastrofe
/**
 * Compile your react code to plain HTML using babel compiler
 */
@Injectable()
export class ReactToHtmlService {
  async compile(code: string) {
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
    exports.default = typeof EmailComponent !== "undefined" ? EmailComponent : (typeof Default !== 'undefined' ? Default : null);
  `;

    vm.runInContext(wrappedCode, sandbox, {
      timeout: 3000,
      displayErrors: true,
    });

    const EmailComponent = sandbox.exports.default;

    if (!EmailComponent) {
      throw new Error("No email component found. Export as EmailComponent or Default");
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
