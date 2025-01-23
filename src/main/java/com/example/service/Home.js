document.addEventListener('DOMContentLoaded', function () {
    const EASY_BUTTON = document.getElementById('easy-button');
    const MEDIUM_BUTTON = document.getElementById('medium-button');
    const HARD_BUTTON = document.getElementById('hard-button');
    const RULE_BUTTON = document.getElementById('rulesOfTheGame');

    if (EASY_BUTTON) {
        EASY_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/EasyMode.html';
        });
    }

    if (MEDIUM_BUTTON) {
        MEDIUM_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/MediumMode.html';
        });
    }

    if (HARD_BUTTON) {
        HARD_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/HardMode.html';
        });
    }

    if (RULE_BUTTON) {
        RULE_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/RulesOfTheGame.html';
        });
    }
});