document.addEventListener('DOMContentLoaded', function () {
    const BACK_HOME_BUTTON = document.getElementById('back-home-button');
    if (BACK_HOME_BUTTON) {
        BACK_HOME_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/Home.html';
        });
    }
});