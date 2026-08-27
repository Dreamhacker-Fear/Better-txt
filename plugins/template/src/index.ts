import Settings from "./Settings";

import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";

const patches: (() => void)[] = [];

const pairs = [
    ["⦮", "⦯"],
    ["𓂃 ࣪˖ ִֶ", "ִֶ ˖࣪ 𓂃"],
    ["‿̩͙⊱༒︎༻♱༺༒︎⊰‿̩͙", "‿̩͙⊰༒︎༺♱༻༒︎⊱‿̩͙"],
    ["𓂃", "𓂃"],
    ["♱", "♱"]
];

const decorations = [
    "𓂃",
    "࣪˖",
    "ִֶ",
    "♱",
    "༒︎",
    "༻",
    "༺",
    "⊱",
    "⊰"
];

function random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function styleText(text: string): string {
    const input = text.trim();

    if (!input) return input;

    const pair = random(pairs);
    const words = input.split(/\s+/);

    const density = Number(storage.density ?? 0.25);

    const styled = words.map((word, index) => {
        if (
            index > 0 &&
            index < words.length &&
            Math.random() < density
        ) {
            return `${random(decorations)} ${word}`;
        }

        return word;
    }).join(" ");

    return `${pair[0]} ${styled} ${pair[1]}`;
}

export default {
    settings: Settings,

    onLoad() {
        try {
            patches.push(
                commands.registerCommand({
                    name: "style",
                    description: "Randomly style text",
                    options: [
                        {
                            name: "input",
                            description: "Text to style",
                            type: 3,
                            required: true
                        }
                    ],
                    execute: (args: any[]) => {
                        try {
                            const input = args?.find(
                                (x) => x?.name === "input"
                            )?.value;

                            if (!input) return;

                            console.log(
                                "[Better TXT]",
                                styleText(input)
                            );
                        } catch (error) {
                            console.error(
                                "[Better TXT] Command error:",
                                error
                            );
                        }
                    }
                })
            );
        } catch (error) {
            console.error(
                "[Better TXT] Failed to register command:",
                error
            );
        }
    },

    onUnload() {
        for (const unpatch of patches) {
            try {
                unpatch();
            } catch {}
        }

        patches.length = 0;
    }
};
