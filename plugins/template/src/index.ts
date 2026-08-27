import Settings from "./settings.jsx";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";
import { sendTextMessage } from "../../common/index.js";
import { cmdDisplays } from "../../common/index.js";

const pairs = [
    ["⦮", "⦯"],
    ["𓂃 ࣪˖ ִֶ", "ִֶ ˖࣪ 𓂃"],
    ["‿̩͙⊱༒︎༻♱༺༒︎⊰‿̩͙", "‿̩͙⊰༒︎༺♱༻༒︎⊱‿̩͙"],
    ["𓂃", "𓂃"],
    ["♱", "♱"]
];

const inside = [
    "࣪˖",
    "ִֶ",
    "𓂃",
    "♱",
    "༒︎",
    "༻",
    "༺",
    "⊱",
    "⊰"
];

const patches = [];

function random(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function styleText(input) {
    const text = String(input ?? "").trim();

    if (!text) return text;

    const pair = random(pairs);
    const words = text.split(" ");

    const styled = words.map((word, index) => {
        if (
            index > 0 &&
            index < words.length - 1 &&
            Math.random() < (storage.density ?? 0.25)
        ) {
            return `${random(inside)} ${word}`;
        }

        return word;
    }).join(" ");

    return `${pair[0]} ${styled} ${pair[1]}`;
}

export default {
    settings: Settings,

    onLoad() {
        patches.push(
            commands.registerCommand(
                cmdDisplays({
                    type: 1,
                    applicationId: "-1",
                    inputType: 1,
                    name: "style",
                    description: "Randomly style text",
                    options: [
                        {
                            type: 3,
                            required: true,
                            name: "input",
                            description: "Text to style"
                        }
                    ],
                    execute: (rawArgs) => {
                        try {
                            const args = new Map(
                                rawArgs.map((option) => [option.name, option])
                            );

                            const input = args.get("input")?.value;

                            if (!input) return;

                            const output = styleText(input);

                            sendTextMessage(
                                "currentChannel",
                                output,
                                false
                            );
                        } catch (error) {
                            console.error("Style command error:", error);
                        }
                    }
                })
            )
        );
    },

    onUnload() {
        for (const patch of patches) {
            try {
                patch();
            } catch {}
        }

        patches.length = 0;
    }
};
