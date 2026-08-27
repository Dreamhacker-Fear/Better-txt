import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormRow, FormInput } = Forms;

function ToggleRow({
    title,
    description,
    value,
    onChange,
}: {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <FormRow
            label={title}
            subLabel={description}
            trailing={
                <Forms.FormSwitch
                    value={value}
                    onValueChange={onChange}
                />
            }
        />
    );
}

export default function Settings() {
    return (
        <>
            <FormSection title="Style Presets">
                <ToggleRow
                    title="Mystic"
                    description="Uses mystical symbols such as 𓂃, ࣪˖ and ♱."
                    value={storage.mystic ?? true}
                    onChange={(value) => {
                        storage.mystic = value;
                    }}
                />

                <ToggleRow
                    title="Gothic"
                    description="Uses darker symbols such as ༒︎, ♱, ༻ and ༺."
                    value={storage.gothic ?? true}
                    onChange={(value) => {
                        storage.gothic = value;
                    }}
                />

                <ToggleRow
                    title="Bracket"
                    description="Uses matching ⦮ and ⦯ decorations."
                    value={storage.bracket ?? true}
                    onChange={(value) => {
                        storage.bracket = value;
                    }}
                />

                <ToggleRow
                    title="Random Interior"
                    description="Randomly places decorations between words."
                    value={storage.randomInterior ?? true}
                    onChange={(value) => {
                        storage.randomInterior = value;
                    }}
                />
            </FormSection>

            <FormSection title="Custom Style">
                <FormInput
                    title="Beginning"
                    subLabel="Decoration placed before the sentence."
                    value={storage.beginning ?? ""}
                    placeholder="Example: ࣪˖ ִֶ"
                    onChange={(value: string) => {
                        storage.beginning = value;
                    }}
                />

                <FormInput
                    title="Ending"
                    subLabel="Matching decoration placed after the sentence."
                    value={storage.ending ?? ""}
                    placeholder="Example: ִֶ ˖࣪"
                    onChange={(value: string) => {
                        storage.ending = value;
                    }}
                />

                <FormInput
                    title="Interior Characters"
                    subLabel="Characters randomly placed around words."
                    value={storage.interior ?? ""}
                    placeholder="Example: 𓂃 ࣪˖ ִֶ ♱"
                    onChange={(value: string) => {
                        storage.interior = value;
                    }}
                />

                <FormInput
                    title="Density"
                    subLabel="0 = none, 1 = maximum."
                    value={String(storage.density ?? 0.25)}
                    placeholder="0.25"
                    onChange={(value: string) => {
                        const number = Number(value);

                        if (!Number.isNaN(number)) {
                            storage.density = Math.max(
                                0,
                                Math.min(1, number)
                            );
                        }
                    }}
                />
            </FormSection>

            <FormSection title="How It Works">
                <FormRow
                    label="Command"
                    subLabel="Use /style followed by the text you want to decorate."
                />

                <FormRow
                    label="Matching Decorations"
                    subLabel="Beginning and ending decorations are selected as matching pairs."
                />

                <FormRow
                    label="Normal Spaces"
                    subLabel="Spaces between words remain normal spaces."
                />

                <FormRow
                    label="Randomization"
                    subLabel="Interior decorations can be randomly inserted between words."
                />
            </FormSection>
        </>
    );
}
