import { findByProps, findByStoreName } from "@vendetta/metro";
import { React, stylesheet } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { semanticColors } from "@vendetta/ui";
import { Button, Forms } from "@vendetta/ui/components";

import { ScrollView } from "react-native";

import { sendRequest } from "./index";

const { FormSection, FormInput, FormRow, FormSwitch, FormText } = Forms;

const UserStore = findByStoreName("UserStore");
const profiles = findByProps("showUserProfile");

const styles = stylesheet.createThemedStyleSheet({
    subText: {
        fontSize: 14,
        marginLeft: 16,
        marginRight: 16,
        color: semanticColors.TEXT_MUTED
    },
    textLink: {
        color: semanticColors.TEXT_LINK,
    }
});

export default function ConfigEditor({ selection }: { selection: string }) {
    const storedSettings = useProxy(storage.selections[selection]) as Activity;
    // Keep a local copy for editing before saving
    const [localSettings, setLocalSettings] = React.useState({ ...storedSettings });

    // Update local copy on input change
    const updateField = (path: string[], value: any) => {
        const updated = { ...localSettings };
        let ref = updated;
        for (let i = 0; i < path.length - 1; i++) {
            ref[path[i]] ??= {};
            ref = ref[path[i]];
        }
        ref[path[path.length - 1]] = value;
        setLocalSettings(updated);
    };

    // Save localSettings to storage and send presence
    const onUpdatePressed = () => {
        storage.selections[selection] = localSettings;
        sendRequest(localSettings);
    };

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
            <Button
                style={{ margin: 16 }}
                color={"brand"}
                size={Button.Sizes.MEDIUM}
                look={Button.Looks.FILLED}
                onPress={async () => {
                    profiles.showUserProfile({ userId: UserStore.getCurrentUser().id });
                }}
                text="Preview your profile"
            />

            <Button
                style={{ marginHorizontal: 16, marginBottom: 8 }}
                color={"secondary"}
                size={Button.Sizes.MEDIUM}
                look={Button.Looks.FILLED}
                onPress={onUpdatePressed}
                text="UPDATE"
            />

            <FormSection title="Basic" titleStyleType="no_border">
                <FormInput required autoFocus
                    title="Application Name"
                    value={localSettings.name}
                    placeholder="Discord"
                    onChange={v => updateField(["name"], v)}
                />
                <FormInput required
                    title="Application ID"
                    value={localSettings.application_id}
                    placeholder="1054951789318909972"
                    onChange={v => updateField(["application_id"], v)}
                    keyboardType="numeric"
                />
                <FormInput
                    title="Type"
                    value={localSettings.type}
                    placeholder="0"
                    onChange={v => updateField(["type"], v)}
                    keyboardType="numeric"
                />
                <FormInput
                    title="Details"
                    value={localSettings.details}
                    placeholder="Competitive"
                    onChange={v => updateField(["details"], v)}
                />
                <FormInput
                    title="State"
                    value={localSettings.state}
                    placeholder="Playing Solo"
                    onChange={v => updateField(["state"], v)}
                />
            </FormSection>
            <FormSection title="Images">
                <FormInput
                    title="Large Image Asset Key or URL"
                    value={localSettings.assets.large_image}
                    placeholder="large_image_here"
                    onChange={v => updateField(["assets", "large_image"], v)}
                />
                <FormInput
                    title="Large Image Text"
                    value={localSettings.assets.large_text}
                    placeholder="Playing on Joe's lobby"
                    disabled={!localSettings.assets.large_image}
                    onChange={v => updateField(["assets", "large_text"], v)}
                />
                <FormInput
                    title="Small Image Asset Key or URL"
                    value={localSettings.assets.small_image}
                    placeholder="small_image_here"
                    onChange={v => updateField(["assets", "small_image"], v)}
                />
                <FormInput
                    title="Small Image Text"
                    value={localSettings.assets.small_text}
                    placeholder="Solo"
                    disabled={!localSettings.assets.small_image}
                    onChange={v => updateField(["assets", "small_text"], v)}
                />
            </FormSection>
            <FormText style={styles.subText}>
                {"Image assets key can be either a Discord app asset's name or a URL to an image."}
            </FormText>
            <FormSection title="Timestamps">
                <FormRow
                    label="Enable timestamps"
                    subLabel="Set whether to show timestamps or not"
                    trailing={<FormSwitch
                        value={localSettings.timestamps._enabled}
                        onValueChange={v => updateField(["timestamps", "_enabled"], v)}
                    />}
                />
                <FormInput
                    title="Start Timestamp (milliseconds)"
                    value={localSettings.timestamps.start}
                    placeholder="1234567890"
                    disabled={!localSettings.timestamps._enabled}
                    onChange={v => updateField(["timestamps", "start"], v)}
                    keyboardType="numeric"
                />
                <FormInput
                    title="End Timestamp (milliseconds)"
                    value={localSettings.timestamps.end}
                    placeholder="1234567890"
                    disabled={!localSettings.timestamps._enabled}
                    onChange={v => updateField(["timestamps", "end"], v)}
                    keyboardType="numeric"
                />
                <FormRow
                    label="Use current time as start timestamp"
                    subLabel="This will override the start timestamp you set above"
                    disabled={!localSettings.timestamps._enabled}
                    onPress={() => updateField(["timestamps", "start"], String(Date.now()))}
                    trailing={FormRow.Arrow}
                />
            </FormSection>
            <FormText style={styles.subText}>
                Leaving start timestamp blank will use the time the Discord started.
            </FormText>
            <FormSection title="Buttons">
                <FormInput
                    title="First Button Text"
                    value={localSettings.buttons[0].label}
                    placeholder="random link #1"
                    onChange={v => updateField(["buttons", 0, "label"], v)}
                />
                <FormInput
                    title="First Button URL"
                    value={localSettings.buttons[0].url}
                    placeholder="https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
                    disabled={!localSettings.buttons[0].label}
                    onChange={v => updateField(["buttons", 0, "url"], v)}
                />
                <FormInput
                    title="Second Button Text"
                    value={localSettings.buttons[1].label}
                    placeholder="random link #2"
                    onChange={v => updateField(["buttons", 1, "label"], v)}
                />
                <FormInput
                    title="Second Button URL"
                    value={localSettings.buttons[1].url}
                    placeholder="https://youtu.be/w0AOGeqOnFY"
                    disabled={!localSettings.buttons[1].label}
                    onChange={v => updateField(["buttons", 1, "url"], v)}
                />
            </FormSection>
        </ScrollView>
    );
                    }
