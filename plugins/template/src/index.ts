import Settings from "./Settings";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";
import { findByProps, findByStoreName } from "@vendetta/metro/common";

const pairs = [
    ["⦮", "⦯"],
    ["𓂃 ࣪˖ ִֶ", "ִֶ ˖࣪ 𓂃"],
    ["‿̩͙⊱༒︎༻♱༺༒︎⊰‿̩͙", "‿̩͙⊰༒︎༺♱༻༒︎⊱‿̩͙"],
];

function getStyle() {
    return {
        beginning: String(storage.beginning ?? ""),
        ending: String(storage.ending ?? ""),
    };
}

function styleText(text: string) {
    const style = getStyle();

    return `${style.beginning}${text}${style.ending}`;
}

function sendText(text: string) {
    const { getChannelId } = findByStoreName("SelectedChannelStore");
    const MessageActions = findByProps("sendMessage");

    const channelId = getChannelId();

    if (!channelId || !MessageActions?.sendMessage) return;

    MessageActions.sendMessage(channelId, {
        content: text,
    });
}

export default {
    settings: Settings,

    onLoad() {
        commands.registerCommand({
            name: "s",
            description: "Style your text.",
            options: [
                {
                    type: 3,
                    name: "text",
                    description: "Text to style",
                    required: true,
                },
            ],

            execute: (args: any[]) => {
                const text = args?.find(
                    (x) => x?.name === "text",
                )?.value;

                if (!text) return;

                sendText(styleText(text));
            },
        });
    },

    onUnload() {},
};
