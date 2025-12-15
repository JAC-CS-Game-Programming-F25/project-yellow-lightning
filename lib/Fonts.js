export default class Fonts {
    constructor() {
        this.fonts = {};
    }

    load(fontDefinitions) {
        fontDefinitions.forEach((fontDefinition) => {
            const font = new FontFace(
                fontDefinition.name,
                `url(${fontDefinition.path})`
            );

            font.load()
                .then((loadedFont) => {
                    document.fonts.add(loadedFont);
                    this.fonts[
                        fontDefinition.name
                    ] = `${fontDefinition.size} ${fontDefinition.name}`;
                })
                .catch((error) => {
                    console.error(
                        `Failed to load font ${fontDefinition.name}:`,
                        error
                    );
                });
        });
    }

    get(name) {
        return this.fonts[name];
    }
}
