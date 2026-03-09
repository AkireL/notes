import { applyStyle } from "./unicode-style";

export function isEmpty(content: number | string| null | undefined): boolean {
    if (content === "" || content === null || content === undefined) {
        return true;
    }
    return false;
}

export function deriveTitle(content: string| null | undefined): string {
    if (isEmpty(content)) {
        return 'Sin título';
    }

    const cleanContent = content?.trim() ?? '';

    if (isEmpty(cleanContent)) {
        return 'Sin título';
    }

    let firstLine = '';
    let foundNewLine = false;

    for (let i = 0; i < cleanContent.length; i = i + 1) {
        const char = cleanContent[i];

        if (char === '\n') {
            foundNewLine = true;
            break;
        }

        firstLine = firstLine + char;
    }

    if (firstLine.trim() === '') {
        return 'Sin título';
    }

    if (firstLine.length > 50) {
        firstLine = firstLine.slice(0, 50) + '...';
    }

    return firstLine.trim();
}

export function truncateContent(content: string, maxLength: number = 100): string {
    if (content.length > maxLength) {
        return `${content.slice(0, maxLength)}...`;
    }
    return content;
}

export function formatUnicode(text: string): string {

    // titles
    text = text.replace(/^# (.*$)/gm, (_, t) =>
        applyStyle(t.toUpperCase(), "bold")
    )

    // bold
    text = text.replace(/\*\*(.*?)\*\*/g, (_, t) =>
        applyStyle(t, "bold")
    )

    // italic
    text = text.replace(/\*(.*?)\*/g, (_, t) =>
        applyStyle(t, "italic")
    )

    text = text.replace(/_(.*?)_/g, (_, t) => applyStyle(t, "italic"))

    // monospace
    text = text.replace(/`(.*?)`/g, (_, t) =>
        applyStyle(t, "monospace")
    )

    return text
}