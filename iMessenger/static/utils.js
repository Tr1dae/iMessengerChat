export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function scalePhoneScreen() {
    const phoneScreen = document.querySelector('.phone-screen');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const phoneWidth = 510; // Original width of the phone screen
    const phoneHeight = 990; // Original height of the phone screen

    const scaleX = windowWidth / phoneWidth;
    const scaleY = windowHeight / phoneHeight;
    const scale = Math.min(scaleX, scaleY);

    phoneScreen.style.transform = `scale(${scale})`;
    phoneScreen.style.transformOrigin = 'top left';

    const scaledWidth = phoneWidth * scale;
    const scaledHeight = phoneHeight * scale;
    const offsetX = (windowWidth - scaledWidth) / 2;
    const offsetY = (windowHeight - scaledHeight) / 2;

    phoneScreen.style.left = `${offsetX}px`;
    phoneScreen.style.top = `${offsetY}px`;
    phoneScreen.style.position = 'absolute';
}

window.addEventListener('load', scalePhoneScreen);
window.addEventListener('resize', scalePhoneScreen);