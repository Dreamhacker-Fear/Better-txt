import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormInput, FormRow } = Forms;

export default function Settings() {
    const savedStyles = storage.savedStyles ?? {};

    const saveStyle = (name: string) => {
        name = name.trim();

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
        storage.beginning = style.beginning ?? "";
        storage.ending = style.ending ?? "";
    };

    return (
        <>
            <FormSection title="Current Style">
                <FormInput
                    title="Beginning"
                    subLabel="Put anything here that should appear before your message."
                    value={storage.beginning ?? ""}
                    placeholder="Example: ࣪˖ ִֶ "
                    onChange={(value: string) => {
                        storage.beginning = value;
                    }}
                />

                <FormInput
                    title="Ending"
                    subLabel="Put anything here that should appear after your message."
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
                    subLabel="Type a name and press Enter to save the current beginning and ending."
                    value={storage.styleName ?? ""}
                    placeholder="Example: Ultron"
                    onChange={(value: string) => {
                        storage.styleName = value;
                    }}
                    onSubmit={(value: string) => {
                        saveStyle(value);
                    }}
                />
            </FormSection>

            <FormSection title="Saved Styles">
                {Object.keys(savedStyles).length === 0 ? (
                    <FormRow
                        label="No Saved Styles"
                        subLabel="Save a style above to see it here."
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
                    label="/style on"
                    subLabel="Automatically add your chosen beginning and ending to messages."
                />

                <FormRow
                    label="/style off"
                    subLabel="Turn automatic styling off."
                />

                <FormRow
                    label="How it works"
                    subLabel="Your message itself is not changed. Only the saved beginning and ending are added."
                />
            </FormSection>
        </>
    );
}
