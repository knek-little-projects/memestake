export default function (path) {
    if (path[0] !== "/") {
        path = "/" + path
    }
    return process.env.PUBLIC_URL + path
}