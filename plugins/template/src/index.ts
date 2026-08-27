import Settings from "./Settings";
import { commands } from "@vendetta";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const patches: (() => void)[] = [];

const pairs = [
    ["⦮", "⦯"],
    ["𓂃 ࣪˖ ִֶ", "ִֶ ˖࣪ 𓂃"],
    ["‿̩͙⊱༒︎༻♱༺༒︎⊰‿̩͙", "‿̩͙⊰༒︎༺♱༻༒︎⊱‿̩͙"],
    ["𓂃", "𓂃"],
    ["♱", "♱"],
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
    "⊰",
];

function random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function styleText(text: string): string {
    const words = text.trim().split(/\s+/);

    if (!words.length || !words[0]) return text;

    const pair = random(pairs);
    const density = Number(storage.density ?? 0.25);

    const styled = words
        .map((word, index) => {
            if (
                index > 0 &&
                index < words.length &&
                Math.random() < density
            ) {
                return `${random(decorations)} ${word}`;
            }

            return word;
        })
        .join(" ");

    return `${pair[0]} ${styled} ${pair[1]}`;
}

function sendText(text: string, ephemeral = false) {
    const { getChannelId } =
        findByStoreName("SelectedChannelStore");

    const { sendMessage } =
        findByProps("sendMessage");

    const channelId = getChannelId();

    if (!channelId) {
        throw new Error("Could not find current channel");
    }

    sendMessage(
        channelId,
        {
            content: text,
            _command_output: true,
        },
        undefined,
        ephemeral,
    );
}

export default {
    settings: Settings,

    onLoad() {
        try {
            const command = commands.registerCommand({
                name: "style",
                description: "Style text with randomized decorations.",
                options: [
                    {
                        type: 3,
                        required: true,
                        name: "input",
                        description: "Text to style",
                    },
                    {
                        type: 5,
                        required: false,
                        name: "send",
                        description: "Send the styled text",
                    },
                ],

                execute: (rawArgs: any[]) => {
                    try {
                        const args = new Map(
                            rawArgs.map((option) => [
                                option.name,
                                option,
                            ]),
                        );

                        const input = args.get("input")?.value;

                        if (!input) return;

                        const output = styleText(input);

                        const shouldSend =
                            args.get("send")?.value ?? true;

                        sendText(output, !shouldSend);
                    } catch (error) {
                        console.error(
                            "[Better TXT] Style command error:",
                            error,
                        );
                    }
                },
            });

            patches.push(command);
        } catch (error) {
            console.error(
                "[Better TXT] Failed to register /style:",
                error,
            );
        }
    },

    onUnload() {
        for (const patch of patches) {
            try {
                patch();
            } catch {}
        }

        patches.length = 0;
    },
};
