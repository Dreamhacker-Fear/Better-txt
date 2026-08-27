import Settings from "./Settings";
import { metro } from "@vendetta/metro/common";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";

const patches: (() => void)[] = [];

function getCurrentChannel() {
    try {
        return metro
            .findByProps("getChannelId")
            ?.getChannelId?.();
    } catch {
        return null;
    }
}

function sendMessage(channelId: string, content: string) {
    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) {
        throw new Error("sendMessage not found");
    }

    return MessageActions.sendMessage(channelId, {
        content,
    });
}

function styleText(text: string): string {
    const beginning = String(storage.beginning ?? "");
    const ending = String(storage.ending ?? "");

    return `${beginning}${text}${ending}`;
}

function getActiveStyle() {
    const saved = storage.savedStyles ?? {};
    const active = storage.activeStyle;

    if (active && saved[active]) {
        return saved[active];
    }

    return {
        beginning: storage.beginning ?? "",
        ending: storage.ending ?? "",
    };
}

export default {
    settings: Settings,

    onLoad() {
        try {
            storage.enabled = storage.enabled ?? false;
            storage.savedStyles = storage.savedStyles ?? {};

            const styleCommand = commands.registerCommand({
                name: "style",
                description: "Turn automatic sentence styling on or off.",
                options: [
                    {
                        name: "mode",
                        description: "Enable or disable Style Mode.",
                        type: 3,
                        required: true,
                        choices: [
                            {
                                name: "On",
                                value: "on",
                            },
                            {
                                name: "Off",
                                value: "off",
                            },
                        ],
                    },
                ],

                execute: (args: any[]) => {
                    try {
                        const mode = args?.find(
                            (arg) => arg?.name === "mode",
                        )?.value;

                        if (mode === "on") {
                            storage.enabled = true;
                        }

                        if (mode === "off") {
                            storage.enabled = false;
                        }
                    } catch (error) {
                        console.error(
                            "[Better TXT] Command error:",
                            error,
                        );
                    }
                },
            });

            patches.push(styleCommand);

            const MessageActions =
                metro.findByProps("sendMessage");

            if (!MessageActions?.sendMessage) {
                console.warn(
                    "[Better TXT] sendMessage not found",
                );
                return;
            }

            const originalSend =
                MessageActions.sendMessage;

            MessageActions.sendMessage = function (
                channelId: string,
                message: any,
                ...rest: any[]
            ) {
                try {
                    if (
                        storage.enabled &&
                        message &&
                        typeof message.content === "string" &&
                        !message._betterTxtStyled &&
                        !message.content.startsWith("/")
                    ) {
                        const style = getActiveStyle();

                        message = {
                            ...message,
                            content:
                                style.beginning +
                                message.content +
                                style.ending,
                            _betterTxtStyled: true,
                        };
                    }
                } catch (error) {
                    console.error(
                        "[Better TXT] Formatting error:",
                        error,
                    );
                }

                return originalSend.call(
                    this,
                    channelId,
                    message,
                    ...rest,
                );
            };

            patches.push(() => {
                MessageActions.sendMessage =
                    originalSend;
            });
        } catch (error) {
            console.error(
                "[Better TXT] Failed to load:",
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
