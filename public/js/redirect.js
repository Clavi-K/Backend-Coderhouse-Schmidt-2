setTimeout(redirect, 2000);

function redirect() {
    location.replace(`${location.origin}/`)
}
