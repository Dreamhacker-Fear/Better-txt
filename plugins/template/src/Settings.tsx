import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormInput, FormRow } = Forms;

export default function Settings() {
    const savedStyles = storage.savedStyles ?? {};

    const saveStyle = () => {
        const name = String(storage.styleName ?? "").trim();

        if (!name) return;

        storage.savedStyles = {
            ...savedStyles,
            [name]: {
                beginning: storage.beginning ?? "",
                ending: storage.ending ?? "",
            },
        };

        storage.activeStyle = name;
        storage.styleName = "";
    };

    const selectStyle = (name: string) => {
        const style = storage.savedStyles?.[name];

        if (!style) return;

        storage.activeStyle = name;
        storage.beginning = style.beginning;
        storage.ending = style.ending;
    };

    return (
        <>
            <FormSection title="Current Style">
                <FormInput
                    title="Beginning"
                    subLabel="Text or symbols placed before your message."
                    value={storage.beginning ?? ""}
                    placeholder="Example: ࣪˖ ִֶ "
                    onChange={(value: string) => {
                        storage.beginning = value;
                    }}
                />

                <FormInput
                    title="Ending"
                    subLabel="Text or symbols placed after your message."
                    value={storage.ending ?? ""}
                    placeholder="Example: ִֶ ˖࣪"
                    onChange={(value: string) => {
                        storage.ending = value;
                    }}
                />
            </FormSection>

            <FormSection title="Save Style">
                <FormInput
                    title="Style Name"
                    subLabel="Give your current beginning and ending a name."
                    value={storage.styleName ?? ""}
                    placeholder="Example: Ultron"
                    onChange={(value: string) => {
                        storage.styleName = value;
                    }}
                />

                <FormRow
                    label="Save Current Style"
                    subLabel="Save the beginning and ending above."
                    trailing={
                        <Forms.FormButton
                            text="Save"
                            onPress={saveStyle}
                        />
                    }
                />
            </FormSection>

            <FormSection title="Saved Styles">
                {Object.keys(savedStyles).length === 0 ? (
                    <FormRow
                        label="No Saved Styles"
                        subLabel="Create a style above and save it."
                    />
                ) : (
                    Object.keys(savedStyles).map((name) => (
                        <FormRow
                            key={name}
                            label={name}
                            subLabel={
                                storage.activeStyle === name
                                    ? "Active style"
                                    : "Tap to use this style"
                            }
                            onPress={() => selectStyle(name)}
                        />
                    ))
                )}
            </FormSection>

            <FormSection title="Style Mode">
                <FormRow
                    label="How to enable"
                    subLabel="Use /style on to automatically style your messages."
                />

                <FormRow
                    label="How to disable"
                    subLabel="Use /style off to return to normal messages."
                />

                <FormRow
                    label="What gets changed"
                    subLabel="Only your chosen beginning and ending are added. Your message stays unchanged."
                />
            </FormSection>
        </>
    );
}
