/*
 * MIT License
 *
 * Copyright (c) 2023 Galib Jaman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.convertToLaravelAssetPath', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active text editor. Please open a file to convert.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const selectedText = document.getText(selection);

    if (!selectedText.trim()) {
      const convertWholeFile = await vscode.window.showInformationMessage(
        "No text selected. Do you want to check the fun of whole file?",
        { modal: true },
        "Yes",
        "No"
      );

      if (convertWholeFile === "Yes") {
        const entireDocumentRange = document.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
        const entireText = document.getText(entireDocumentRange);
        const convertedText = convertToLaravelSyntax(entireText);
        
        editor.edit(editBuilder => {
          console.log(convertedText);
          editBuilder.replace(entireDocumentRange, convertedText);
        });
      }
    } else {
      const convertedText = convertToLaravelSyntax(selectedText);
      editor.edit(editBuilder => {
        editBuilder.replace(selection, convertedText);
        console.log(selection);
      });
    }
  });
  // context.subscriptions.push(disposable);
}

function convertToLaravelSyntax(text: string): string {
  const $ = cheerio.load(text, { xmlMode: false, decodeEntities: false });

  // Convert attributes to Blade asset paths
  $('img, script, link').each((index, element) => {
    const tagName = element.tagName.toLowerCase();

    let attribute;
    if (tagName === 'img') {
      attribute = 'src';
    } else if (tagName === 'script') {
      attribute = 'src';
    } else if (tagName === 'link') {
      attribute = 'href';
    } else {
      return;
    }

    const value = $(element).attr(attribute);
    if (
      value &&
      !value.startsWith("https://") &&
      !value.startsWith("http://") &&
      !value.trim().startsWith("{{ asset(") &&
      !value.trim().startsWith("{{") &&
      !/{{\s*asset\(\s*["'][^"']*["']\s*\)\s*}}/.test(value) 
      // && !$(element).find('a').length
      ) {
      console.log(value);
      // Use single quotes directly without HTML encoding
      $(element).attr(attribute, `{{ asset('${value}') }}`);
    }
  });

  let parsedHTML = $.root().html() || '';
  // If the parsedHTML contains &quot; then replace it with single quote
  if (parsedHTML.includes('&quot;')) {
    parsedHTML = parsedHTML.replace(/&quot;/g, "'");
  }
  
  const selfClosingTags = [
  'body', 'head', 'html', 'img', 'br', 'hr', 'area', 'base', 'col', 'command', 'embed', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'audio', 'video'
];

selfClosingTags.forEach(tag => {
  if (!text.includes(`</${tag}>`)) {
    parsedHTML = parsedHTML.replace(new RegExp(`<\/${tag}>`, 'g'), '');
    // parsedHTML = parsedHTML.replace(/<\/img>/g, '');
  }
});
['head', 'body', 'html'].forEach(tag => {
  if (!text.includes(`<${tag}>`)) {
    parsedHTML = parsedHTML.replace(new RegExp(`<${tag}>`, 'g'), '');
    // parsedHTML = parsedHTML.replace(/<\/img>/g, '');
  }
});
  
  return parsedHTML;
}














// if (!text.includes('</wbr>')) {
//   parsedHTML = parsedHTML.replace(/<\/wbr>/g, '');
// }
// if (!text.includes('</audio>')) {
//   parsedHTML = parsedHTML.replace(/<\/audio>/g, '');
// }
// if (!text.includes('</video>')) {
//   parsedHTML = parsedHTML.replace(/<\/video>/g, '');
// }