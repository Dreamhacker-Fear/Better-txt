import { metro } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

let unpatch: (() => void) | null = null;

function formatSentence(text: string): string {
    let result = text.trim();

    if (!result) return text;

    result = result.charAt(0).toUpperCase() + result.slice(1);

    result = result
        .replace(/\bi\b/g, "I")
        .replace(/\bim\b/gi, "I'm")
        .replace(/\bive\b/gi, "I've")
        .replace(/\bid\b/gi, "I'd")
        .replace(/\bill\b/gi, "I'll")
        .replace(/\bwhats\b/gi, "what's")
        .replace(/\bthats\b/gi, "that's")
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
        .replace(/\bwouldnt\b/gi, "wouldn't")
        .replace(/\bimma\b/gi, "I'm gonna");

    result = result.replace(/\s+([,.!?])/g, "$1");
    result = result.replace(/([,.!?])([^\s])/g, "$1 $2");

    if (!/[.!?]$/.test(result)) {
        if (/^(who|what|when|where|why|how|is|are|do|does|did|can|could|would|will|should)\b/i.test(result)) {
            result += "?";
        } else {
            result += storage.ending ?? ".";
        }
    }

    return result;
}

export default {
    onLoad() {
        const MessageActions = metro.findByProps("sendMessage");

        if (!MessageActions) return;

        unpatch = before(
            "sendMessage",
            MessageActions,
            (args: any[]) => {
                for (const arg of args) {
                    if (
                        arg &&
                        typeof arg === "object" &&
                        typeof arg.content === "string"
                    ) {
                        arg.content = formatSentence(arg.content);
                        break;
                    }
                }
            }
        );
    },

    onUnload() {
        unpatch?.();
        unpatch = null;
    },

    settings: require("./Settings").default,
};
