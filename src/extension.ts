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
