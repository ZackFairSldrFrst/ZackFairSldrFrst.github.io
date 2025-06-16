// iOS Shortcut Generator Module
class iOSShortcutGenerator {
    constructor() {
        this.baseURL = window.location.origin;
    }

    // Generate a proper iOS shortcut file
    generateShortcut(messageData) {
        const shortcut = {
            WFWorkflowActions: [
                // Get the current date/time
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.date",
                    WFWorkflowActionParameters: {
                        WFDateActionMode: "Current Date"
                    }
                },
                // Format the target date
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.format.date",
                    WFWorkflowActionParameters: {
                        WFDateFormatStyle: "Custom",
                        WFDateFormat: messageData.scheduleTime
                    }
                },
                // Calculate time until target
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.date.timedifference",
                    WFWorkflowActionParameters: {
                        WFTimeUntilFromDate: "Ask Each Time",
                        WFTimeUntilUnit: "Total Time"
                    }
                },
                // Wait until the scheduled time
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.delay",
                    WFWorkflowActionParameters: {
                        WFDelayTime: {
                            Value: {
                                attachmentsByRange: {
                                    "{0, 1}": {
                                        Type: "ActionOutput",
                                        OutputName: "Time Difference",
                                        OutputUUID: "time-diff-uuid"
                                    }
                                },
                                string: "⁨Time Difference⁩"
                            },
                            WFSerializationType: "WFTextTokenString"
                        }
                    }
                },
                // Send the message
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.sendmessage",
                    WFWorkflowActionParameters: {
                        WFSendMessageActionRecipients: [messageData.phone],
                        WFSendMessageContent: messageData.message,
                        WFSendMessageActionApp: "Messages"
                    }
                }
            ],
            WFWorkflowClientVersion: "2605.0.5",
            WFWorkflowHasShortcutInputVariables: false,
            WFWorkflowIcon: {
                WFWorkflowIconStartColor: 946986751,
                WFWorkflowIconGlyphNumber: 61440
            },
            WFWorkflowImportQuestions: [],
            WFWorkflowInputContentItemClasses: [
                "WFAppContentItem",
                "WFAppStoreAppContentItem",
                "WFArticleContentItem",
                "WFContactContentItem",
                "WFDateContentItem",
                "WFEmailAddressContentItem",
                "WFGenericFileContentItem",
                "WFImageContentItem",
                "WFiTunesProductContentItem",
                "WFLocationContentItem",
                "WFDCMapsLinkContentItem",
                "WFAVAssetContentItem",
                "WFPDFContentItem",
                "WFPhoneNumberContentItem",
                "WFRichTextContentItem",
                "WFSafariWebPageContentItem",
                "WFStringContentItem",
                "WFURLContentItem"
            ],
            WFWorkflowMinimumClientVersion: 900,
            WFWorkflowName: `Scheduled Message to ${messageData.recipient}`,
            WFWorkflowTypes: []
        };

        return shortcut;
    }

    // Generate a simpler automation-based shortcut
    generateSimpleShortcut(messageData) {
        const scheduleDate = new Date(messageData.scheduleTime);
        const now = new Date();
        const delay = Math.max(0, Math.floor((scheduleDate - now) / 1000));

        const shortcut = {
            WFWorkflowActions: [
                // Show notification that scheduling is starting
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.shownotification",
                    WFWorkflowActionParameters: {
                        WFNotificationActionTitle: "Message Scheduled",
                        WFNotificationActionBody: `Your message to ${messageData.recipient} will be sent at ${scheduleDate.toLocaleString()}`
                    }
                },
                // Wait for the specified time
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.delay",
                    WFWorkflowActionParameters: {
                        WFDelayTime: delay
                    }
                },
                // Send the message
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.sendmessage",
                    WFWorkflowActionParameters: {
                        WFSendMessageActionRecipients: [messageData.phone],
                        WFSendMessageContent: messageData.message
                    }
                },
                // Confirm message was sent
                {
                    WFWorkflowActionIdentifier: "is.workflow.actions.shownotification",
                    WFWorkflowActionParameters: {
                        WFNotificationActionTitle: "Message Sent!",
                        WFNotificationActionBody: `Your scheduled message was sent to ${messageData.recipient}`
                    }
                }
            ],
            WFWorkflowClientVersion: "2605.0.5",
            WFWorkflowHasShortcutInputVariables: false,
            WFWorkflowIcon: {
                WFWorkflowIconStartColor: 4251333119,
                WFWorkflowIconGlyphNumber: 61440
            },
            WFWorkflowImportQuestions: [],
            WFWorkflowInputContentItemClasses: [],
            WFWorkflowMinimumClientVersion: 900,
            WFWorkflowName: `Message to ${messageData.recipient}`,
            WFWorkflowTypes: ["NCWidget", "WatchKit"]
        };

        return shortcut;
    }

    // Create downloadable shortcut file
    createShortcutFile(messageData) {
        const shortcut = this.generateSimpleShortcut(messageData);
        const shortcutData = JSON.stringify(shortcut, null, 2);
        
        const blob = new Blob([shortcutData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        return {
            url: url,
            filename: `message-to-${messageData.recipient.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.shortcut`,
            data: shortcutData
        };
    }

    // Generate a shareable URL for the shortcut
    generateShareableURL(messageData) {
        const shortcut = this.generateSimpleShortcut(messageData);
        const encoded = this.encodeShortcut(shortcut);
        
        // Create a data URL that can be shared
        const shortcutURL = `shortcuts://import-workflow/?url=${encodeURIComponent(this.baseURL)}/shortcut/${encoded}&name=${encodeURIComponent(messageData.recipient)}`;
        
        return shortcutURL;
    }

    // Encode shortcut data for URL sharing
    encodeShortcut(shortcut) {
        const jsonString = JSON.stringify(shortcut);
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    // Decode shortcut data from URL
    decodeShortcut(encoded) {
        const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - base64.length % 4) % 4);
        const jsonString = decodeURIComponent(escape(atob(base64 + padding)));
        return JSON.parse(jsonString);
    }

    // Create a manual setup instruction
    createManualInstructions(messageData) {
        const scheduleDate = new Date(messageData.scheduleTime);
        
        return {
            title: "Manual Setup Instructions",
            steps: [
                "1. Open the Shortcuts app on your iPhone",
                "2. Tap the '+' button to create a new shortcut",
                "3. Add a 'Wait' action and set it to wait until " + scheduleDate.toLocaleString(),
                "4. Add a 'Send Message' action",
                "5. Set the recipient to: " + messageData.phone,
                "6. Set the message to: " + messageData.message,
                "7. Name your shortcut and save it",
                "8. Run the shortcut when you want to schedule the message"
            ]
        };
    }
}

// Export for use in main script
window.iOSShortcutGenerator = iOSShortcutGenerator; 