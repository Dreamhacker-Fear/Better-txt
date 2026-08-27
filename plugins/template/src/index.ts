import { metro } from "@vendetta/metro/common";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

const disposers: (() => void)[] = [];

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
    const words = text.trim().split(/\s+/);
    const pair = random(pairs);
    const density = Number(storage.density ?? 0.25);

    const result = words.map((word, index) => {
        if (index > 0 && Math.random() < density) {
            return `${random(decorations)} ${word}`;
        }

        return word;
    }).join(" ");

    return `${pair[0]} ${result} ${pair[1]}`;
}

export default {
    settings: Settings,

    onLoad() {
        try {
            const MessageActions = metro.findByProps("sendMessage");

            if (!MessageActions) return;

            const command = commands.registerCommand({
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
                    const input = args?.find(
                        (arg) => arg?.name === "input"
                    )?.value;

                    if (!input) return;

                    const output = styleText(input);

                    try {
                        const channelId =
                            metro.findByProps("getChannelId")?.getChannelId?.();

                        if (!channelId) return;

                        MessageActions.sendMessage(
                            channelId,
                            {
                                content: output
                            }
                        );
                    } catch (error) {
                        console.error("[Better TXT] Send error:", error);
                    }
                }
            });

            disposers.push(command);
        } catch (error) {
            console.error("[Better TXT] Load error:", error);
        }
    },

    onUnload() {
        for (const dispose of disposers) {
            try {
                dispose();
            } catch {}
        }

        disposers.length = 0;
    }
};
