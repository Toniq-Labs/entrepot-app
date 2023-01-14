import {collapseWhiteSpace} from '@augment-vir/common';
import {TemplateResult} from 'lit';

export function convertTemplateToString(template: TemplateResult): string {
    const {strings, values} = template;
    const valueList = [
        ...values,
        '', // this last empty string is so it's easier to deal with indexes
    ];

    const all = strings.map((stringValue, index) => {
        const value = extractValue(stringValue, valueList[index]);
        return `${stringValue}${value}`;
    });

    return collapseWhiteSpace(all.join(''));
}

function extractValue(previousString: string, value: any) {
    if (value._$litType$ != undefined) {
        // nested templates
        return convertTemplateToString(value);
    } else if (Array.isArray(value)) {
        // array of strings or templates.
        const values = value.map(innerValue => convertTemplateToString(innerValue));
        return values.join('');
    } else {
        if (previousString.endsWith('=')) {
            return `"${value}"`;
        } else {
            return value;
        }
    }
}
