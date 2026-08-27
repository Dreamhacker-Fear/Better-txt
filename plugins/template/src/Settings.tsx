import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormInput } = Forms;

export default function Settings() {
    return (
        <FormSection title="Sentence Style">
            <FormInput
                title="Sentence Beginning"
                value={storage.beginning ?? ""}
                placeholder="Example: > "
                onChange={(value: string) => {
                    storage.beginning = value;
                }}
            />

            <FormInput
                title="Sentence Separator"
                value={storage.separator ?? ", "}
                placeholder="Example: , "
                onChange={(value: string) => {
                    storage.separator = value;
                }}
            />

            <FormInput
                title="Sentence Ending"
                value={storage.ending ?? "."}
                placeholder="Example: ."
                onChange={(value: string) => {
                    storage.ending = value;
                }}
            />
        </FormSection>
    );
}
