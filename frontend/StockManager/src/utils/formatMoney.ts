export function formatMoney(value: number): string {
    const abs = Math.abs(value);
    let result = "";

    if (abs >= 1000000000000) {
        result = (value / 1000000000000).toFixed(2).replace(/\.0$/, '') + 'T';
    }
    else if (abs >= 1000000000) {
        result = (value / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
    } 
    else if (abs >= 1000000) {
        result = (value / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    } 
    else if (abs >= 1000) {
        result = (value / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    } 
    else {
        result = value.toFixed(2).toString();
    }

    return result;
}