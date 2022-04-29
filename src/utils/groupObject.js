export function groupArrayOfObjects(list, key) {
    return list.reduce(function (r, a) {
        r[a[key]] = r[a[key]] || [];
        r[a[key]].push(a);
        return r;
    }, Object.create(null));
}