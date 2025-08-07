export function makeVtt(srtText: string) {
    let vttStr = '';
    const lines = srtText?.split("\n");
    let isStr, isTime = false;
    let time;
    let str = '';
    for (const x in lines) {
        const line = lines[x].trim();

        if (line == "" && isStr) {
            vttStr += time?.replace(/,/g, ".") + "\n";
            vttStr += str + "\n";
            str = '';
            isTime = false;
            isStr = false;
        }

        if (isStr) {
            str += line + "\n";
        }

        if (isTime) {
            time = line;
            isStr = true;
            isTime = false;
        }

        if (!isNaN(Number(line)) && line != "" && !isTime) {
            isTime = true;
        }
    }

    return vttStr;
}

export function makeBlobUrl(srtText: string) {
    const vttStr = makeVtt(srtText);
    const blob = new Blob([`WEBVTT - https://${window.location.href}\n\n` + vttStr], { type: "text/vtt;charset=UTF-8" })
    const url = URL.createObjectURL(blob);
    return url;
}

export const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};