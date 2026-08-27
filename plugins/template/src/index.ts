import Settings from "./Settings";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const patches: (() => void)[] = [];

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

function notify(message: string) {
    try {
        const { showToast } = findByProps("showToast");

        if (showToast) {
            showToast(message);
        }
    } catch {}
}

export default {
    settings: Settings,

    onLoad() {
        storage.enabled = storage.enabled ?? false;
        storage.savedStyles = storage.savedStyles ?? {};

        // /style on
        patches.push(
            commands.registerCommand({
                name: "style on",
                description: "Turn Style Mode on.",
                execute: () => {
                    storage.enabled = true;
                    notify("Style Mode: ON");
                },
            }),
        );

        // /style off
        patches.push(
            commands.registerCommand({
                name: "style off",
                description: "Turn Style Mode off.",
                execute: () => {
                    storage.enabled = false;
                    notify("Style Mode: OFF");
                },
            }),
        );

        try {
            const MessageActions =
                findByProps("sendMessage");

            if (!MessageActions?.sendMessage) return;

            patches.push(
                before(
                    "sendMessage",
                    MessageActions,
                    (args: any[]) => {
                        try {
                            if (
                                !storage.enabled ||
                                !args[1] ||
                                typeof args[1].content !== "string"
                            ) {
                                return;
                            }

                            if (
                                args[1].content.startsWith("/") ||
                                args[1]._betterTxtStyled
                            ) {
                                return;
                            }

                            args[1].content =
                                styleText(args[1].content);

                            args[1]._betterTxtStyled = true;
                        } catch (error) {
                            console.error(
                                "[Better TXT] Formatting error:",
                                error,
                            );
                        }
                    },
                ),
            );
        } catch (error) {
            console.error(
                "[Better TXT] Failed to hook messages:",
                error,
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
    },
};
