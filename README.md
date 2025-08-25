# GolfIn - LinkedIn Experience Enhancement Extension

GolfIn is an extension to enhance your LinkedIn experience — whether for job searching, browsing the site, or making connections.

## Community

**"GolfIn has no paid product and does not offer any subscription. Anyone using GolfIn to promote anything is a scam."**

## Features

### Feed

* Remove posts based on keywords.
* Remove the feed entirely (ideal for focus and productivity).

### Jobs

* Remove jobs from certain **domains** (configurable by list).
* Remove jobs from specific **companies** (configurable by list).
* Hide jobs you've already applied to using **Easy Apply**.
* Display **full URL** and **icons** in job listings.
* Save searches while searching for jobs.
* Remove **"promoted"** job listings.

### My Network

* Accept **connections automatically**.

## Getting Started

### Development

1. Install dependencies and start the development server:

```bash
pnpm dev
# or
npm run dev
```

2. Load the development build in your browser.
   For example: for Chrome using manifest v3, use `build\chrome-mv3-dev`. Load it as "unpacked", select the folder and you're ready to start developing.
3. Edit the `popup.tsx` file to customize the popup — it will reload automatically.

* To add an options page → create `options.tsx` in the project root.
* To add a content script → create `content.ts` in the root and add your logic.

Full Plasmo documentation: [Plasmo Docs](https://docs.plasmo.com/)

## Production Build

```bash
pnpm build && pnpm package
# or
npm run build && npm run package
```

## Documentation

Documentation is available in multiple languages:

* [Portuguese (pt-BR)](./docs/pt-BR/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you find this extension helpful, please consider:

- Giving it a star on GitHub
- Sharing it with your network
- Reporting any issues or suggestions
