# LaravelAssetify

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/your-publisher-name.laravelassetify)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/your-publisher-name.laravelassetify)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/your-publisher-name.laravelassetify)
![GitHub](https://img.shields.io/github/license/MrShadow03/LaravelAssetify)

## Description

LaravelAssetify is a Visual Studio Code extension that converts HTML image, script, and link paths to Laravel asset paths. This extension helps you easily switch your static asset paths to use Laravel's `asset()` helper function.

## Features

- Convert image (`<img>`), script (`<script>`), and link (`<link>`) paths to Laravel asset paths.
- Automatically detects paths that are already in Laravel asset format or start with "https://" and skips conversion for those.
- Supports converting the selected text or the entire file.

## Requirements

This extension requires Visual Studio Code version 1.80.0 or higher.

## How to Use

1. Open a HTML file in Visual Studio Code.
2. Select the text containing image, script, or link paths that you want to convert.
3. Right-click on the selected text or use the command palette (Ctrl+Shift+P) and search for "Convert to Laravel Asset Path."
4. If nothing is selected, the extension will prompt you to convert the entire file.
5. The extension will convert the paths to use Laravel's `asset()` function, excluding paths already in the correct format or starting with "https://".

## License

This extension is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests on [GitHub](https://github.com/MrShadow03/LaravelAssetify).

## Feedback

If you have any feedback, suggestions, or issues, please let us know by opening an issue on [GitHub](https://github.com/MrShadow03/LaravelAssetify).

## Credits

This extension was developed by [Galib Jaman](https://github.com/MrShadow03).

---

**Enjoy! If you find LaravelAssetify helpful, consider leaving a review on the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/publishers/your-publisher-name). Thanks!**

