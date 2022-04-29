export function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const a = new FileReader();
        a.onload = function(e) {resolve(e.target.result);}
        a.onerror = reject;
        a.readAsDataURL(blob);
    })
}
export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}

