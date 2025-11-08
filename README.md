# UO Mod Analyzer

A web application that extracts and analyzes MOD information from Ultima Online item images using OCR (Optical Character Recognition) technology.

## 🌐 Live Demo

[**UO Mod Analyzer**](https://tkitsunai.github.io/uo-mod-analyzer/) - Deployed on GitHub Pages

## ✨ Features

- 📸 **Image Upload**: Upload game screenshots or paste from clipboard
- 🔍 **OCR Analysis**: Extract text from images using Tesseract.js
- 📊 **MOD Information Extraction**: Automatically parse UO item MODs
- 📝 **Editable Results**: Modify extracted MOD data inline
- 📋 **Item History**: Save and manage analyzed items
- 📈 **CSV Export**: Export data to CSV files or clipboard
- 🔎 **Search & Filter**: Find items by name or MOD properties
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 19** + **TypeScript** - Modern frontend framework
- **Vite** - Fast build tool and development server
- **Tesseract.js** - OCR engine for text recognition
- **Clean Architecture** - Maintainable code structure
- **GitHub Pages** - Deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/tkitsunai/uo-mod-analyzer.git
cd uo-mod-analyzer

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

The development server will start at `http://localhost:5173`.

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
uo-mod-analyzer/
├── src/
│   ├── components/          # UI components
│   ├── hooks/              # Custom React hooks
│   ├── domain/             # Business logic and entities
│   ├── usecases/           # Application use cases
│   └── infrastructure/     # External services and storage
├── public/                 # Static assets
└── .github/               # GitHub Actions and documentation
```

## 🔧 Usage

1. **Upload Image**: Click "Select Image" or drag & drop an image
2. **Analyze**: Click "Analyze" to start OCR processing
3. **Review Results**: Check extracted MOD information
4. **Edit if Needed**: Modify any incorrect data
5. **Save to History**: Store the analyzed item
6. **Export**: Download CSV or copy to clipboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR library
- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Build tool
