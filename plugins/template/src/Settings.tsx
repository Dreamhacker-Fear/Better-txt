import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormInput } = Forms;

export default function Settings() {
    return (
        <FormSection title="Style">
            <FormInput
                title="Density"
                value={String(storage.density ?? 0.25)}
                placeholder="0.25"
                onChange={(value) => {
                    const number = Number(value);

                    if (!Number.isNaN(number)) {
                        storage.density = Math.max(0, Math.min(1, number));
                    }
                }}
            />

            <FormInput
                title="Space Character"
                value={storage.space ?? " "}
                placeholder=" "
                onChange={(value) => {
                    storage.space = value;
                }}
            />

            <FormInput
                title="Extra Characters"
                value={storage.extra ?? ""}
                placeholder="Add custom characters"
                onChange={(value) => {
                    storage.extra = value;
                }}
            />
        </FormSection>
    );
}
