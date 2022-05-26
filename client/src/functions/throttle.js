function throttle(func, ms) {
    let isThrottled = false;
    function wrapper() {
        if (isThrottled) {
            return;
        }
        func.apply(this, arguments);

        isThrottled = true;
        setTimeout(function () {
            isThrottled = false;
        }, ms);
    }

    return wrapper;
}

export default throttle;