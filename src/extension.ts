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
        "No text selected. Do you want to check the whole file?",
        { modal: true },
        "Yes",
        "No"
      );

      if (convertWholeFile === "Yes") {
        const entireDocumentRange = document.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
        const entireText = document.getText(entireDocumentRange);
        const convertedText = convertToLaravelSyntax(entireText);

        editor.edit(editBuilder => {
          editBuilder.replace(entireDocumentRange, convertedText);
        });
      }
    } else {
      const convertedText = convertToLaravelSyntax(selectedText);
      editor.edit(editBuilder => {
        editBuilder.replace(selection, convertedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}

function convertToLaravelSyntax(text: string): string {
  const $ = cheerio.load(text);

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
      !value.trim().startsWith("{{ asset(") &&
      !/{{\s*asset\(\s*'[^']+'\s*\)\s*}}/.test(value) &&
      !$(element).find('a').length
    ) {
      $(element).attr(attribute, `{{ asset('${value}') }}`);
    }
  });

  return $.html();
}
