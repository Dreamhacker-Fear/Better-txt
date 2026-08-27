import { metro } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import Settings from "./Settings";

let unpatch: (() => void) | null = null;

function formatText(text: string): string {
    if (!text.trim()) return text;

    let result = text.trim();

    result = result.charAt(0).toUpperCase() + result.slice(1);

    result = result
        .replace(/\bim\b/gi, "I'm")
        .replace(/\bive\b/gi, "I've")
        .replace(/\bid\b/gi, "I'd")
        .replace(/\bill\b/gi, "I'll")
        .replace(/\bwhats\b/gi, "what's")
        .replace(/\bthats\b/gi, "that's")
        .replace(/\bdont\b/gi, "don't")
        .replace(/\bcant\b/gi, "can't")
        .replace(/\bwont\b/gi, "won't")
        .replace(/\bdidnt\b/gi, "didn't")
        .replace(/\bdoesnt\b/gi, "doesn't")
        .replace(/\bisnt\b/gi, "isn't")
        .replace(/\barent\b/gi, "aren't")
        .replace(/\bwasnt\b/gi, "wasn't")
        .replace(/\bwerent\b/gi, "weren't")
        .replace(/\bshouldnt\b/gi, "shouldn't")
        .replace(/\bcouldnt\b/gi, "couldn't")
        .replace(/\bwouldnt\b/gi, "wouldn't");

    result = result.replace(/\s+([,.!?])/g, "$1");
    result = result.replace(/([,.!?])([^\s])/g, "$1 $2");

    if (!/[.!?]$/.test(result)) {
        if (/^(who|what|when|where|why|how|is|are|do|does|did|can|could|would|will|should)\b/i.test(result)) {
            result += "?";
        } else {
            result += ".";
        }
    }

    return result;
}

export default {
    onLoad() {
        try {
            const MessageActions = metro.findByProps("sendMessage");

            if (!MessageActions) return;

            unpatch = before(
                "sendMessage",
                MessageActions,
                (args: any[]) => {
                    try {
                        for (const arg of args) {
                            if (
                                arg &&
                                typeof arg === "object" &&
                                typeof arg.content === "string"
                            ) {
                                arg.content = formatText(arg.content);
                                break;
                            }
                        }
                    } catch {}
                }
            );
        } catch {}
    },

    onUnload() {
        try {
            if (unpatch) {
                unpatch();
                unpatch = null;
            }
        } catch {
            unpatch = null;
        }
    },

    settings: Settings
};
