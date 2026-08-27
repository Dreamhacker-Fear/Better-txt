import Settings from "./Settings";
import { metro } from "@vendetta/metro/common";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";

const patches: (() => void)[] = [];

function getActiveStyle() {
    const savedStyles = storage.savedStyles ?? {};
    const activeStyle = storage.activeStyle;

    if (activeStyle && savedStyles[activeStyle]) {
        return savedStyles[activeStyle];
    }

    return {
        beginning: storage.beginning ?? "",
        ending: storage.ending ?? "",
    };
}

function styleText(text: string): string {
    const style = getActiveStyle();

    return `${style.beginning}${text}${style.ending}`;
}

export default {
    settings: Settings,

    onLoad() {
        try {
            storage.enabled = storage.enabled ?? false;
            storage.savedStyles = storage.savedStyles ?? {};

            const command = commands.registerCommand({
                name: "style",
                description: "Turn automatic text styling on or off.",
                options: [
                    {
                        type: 3,
                        required: true,
                        name: "mode",
                        description: "Type on or off",
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

                        const mode = String(
                            args.get("mode")?.value ?? "",
                        ).toLowerCase();

                        if (mode === "on") {
                            storage.enabled = true;
                            return;
                        }

                        if (mode === "off") {
                            storage.enabled = false;
                            return;
                        }

                        console.log(
                            "[Better TXT] Use /style on or /style off",
                        );
                    } catch (error) {
                        console.error(
                            "[Better TXT] Command error:",
                            error,
                        );
                    }
                },
            });

            patches.push(command);

            const MessageActions =
                metro.findByProps("sendMessage");

            if (!MessageActions?.sendMessage) {
                console.warn(
                    "[Better TXT] sendMessage was not found",
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
                        message = {
                            ...message,
                            content: styleText(
                                message.content,
                            ),
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
                "[Better TXT] Load error:",
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
