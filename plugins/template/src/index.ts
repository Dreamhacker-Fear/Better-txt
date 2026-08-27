import Settings from "./Settings";
import { metro } from "@vendetta/metro/common";
import { commands } from "@vendetta";
import { storage } from "@vendetta/plugin";

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

function showConfirmation(text: string) {
    try {
        const Toasts = metro.findByProps(
            "open",
            "showToast",
        );

        if (Toasts?.open) {
            Toasts.open(text);
            return;
        }

        if (Toasts?.showToast) {
            Toasts.showToast(text);
        }
    } catch (error) {
        console.log("[Better TXT] Confirmation:", text);
    }
}

export default {
    settings: Settings,

    onLoad() {
        try {
            storage.enabled = storage.enabled ?? false;
            storage.savedStyles =
                storage.savedStyles ?? {};

            const command =
                commands.registerCommand({
                    name: "style",
                    description:
                        "Control automatic text styling.",
                    options: [
                        {
                            type: 3,
                            required: true,
                            name: "mode",
                            description:
                                "Type on, off, or status.",
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

                                const style = getStyle();

                                showConfirmation(
                                    `Style Mode enabled\nBeginning: ${style.beginning || "(none)"}\nEnding: ${style.ending || "(none)"}`,
                                );

                                return;
                            }

                            if (mode === "off") {
                                storage.enabled = false;

                                showConfirmation(
                                    "Style Mode disabled",
                                );

                                return;
                            }

                            if (mode === "status") {
                                const style = getStyle();

                                showConfirmation(
                                    `Style Mode: ${
                                        storage.enabled
                                            ? "ON"
                                            : "OFF"
                                    }\nBeginning: ${
                                        style.beginning ||
                                        "(none)"
                                    }\nEnding: ${
                                        style.ending ||
                                        "(none)"
                                    }`,
                                );

                                return;
                            }

                            showConfirmation(
                                "Use /style on, /style off, or /style status",
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
                    "[Better TXT] sendMessage not found",
                );
                return;
            }

            const originalSend =
                MessageActions.sendMessage;

            MessageActions.sendMessage =
                function (
                    channelId: string,
                    message: any,
                    ...rest: any[]
                ) {
                    try {
                        if (
                            storage.enabled &&
                            message &&
                            typeof message.content ===
                                "string" &&
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
