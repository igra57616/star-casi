// Настройки рулетки
const wheelNumbers = [
    { number: 0, color: 'green' },   // 0 - зеленый
    { number: 32, color: 'red' },    { number: 15, color: 'black' },
    { number: 19, color: 'red' },    { number: 4, color: 'black' },
    { number: 21, color: 'red' },    { number: 2, color: 'black' },
    { number: 25, color: 'red' },    { number: 17, color: 'black' },
    { number: 34, color: 'red' },    { number: 6, color: 'black' },
    { number: 27, color: 'red' },    { number: 13, color: 'black' },
    { number: 36, color: 'red' },    { number: 11, color: 'black' },
    { number: 30, color: 'red' },    { number: 8, color: 'black' },
    { number: 23, color: 'red' },    { number: 10, color: 'black' },
    { number: 5, color: 'red' },     { number: 24, color: 'black' },
    { number: 16, color: 'red' },    { number: 33, color: 'black' },
    { number: 1, color: 'red' },     { number: 20, color: 'black' },
    { number: 14, color: 'red' },    { number: 31, color: 'black' },
    { number: 9, color: 'red' },     { number: 22, color: 'black' },
    { number: 18, color: 'red' },    { number: 29, color: 'black' },
    { number: 7, color: 'red' },     { number: 28, color: 'black' },
    { number: 12, color: 'red' },    { number: 35, color: 'black' },
    { number: 3, color: 'red' },     { number: 26, color: 'black' }
];

// Игровые параметры
let balance = 5000;
let currentBet = 100;
let currentMultiplier = 0;
let isSpinning = false;
const betSteps = [10, 50, 100, 500];

// Инициализация рулетки
function initWheel() {
    const wheel = document.querySelector('.wheel-numbers');
    const angle = 360 / wheelNumbers.length;

    wheel.innerHTML = '';

    wheelNumbers.forEach((num, i) => {
        const sector = document.createElement('div');
        sector.className = `sector ${num.color}`;
        sector.textContent = num.number;
        sector.style.transform = `rotate(${angle * i}deg)`;
        wheel.appendChild(sector);
    });
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('balance').textContent = balance;
    document.getElementById('current-bet').textContent = currentBet;
// Управление ставками
const customBetInput = document.getElementById('custom-bet-input');
const betPresets = document.querySelectorAll('.bet-preset');

// Обработчик ручного ввода
customBetInput.addEventListener('input', function() {
    currentBet = parseInt(this.value) || 0;
    validateBet();
});

// Кнопки быстрых ставок
betPresets.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.id === 'bet-max') {
            currentBet = balance;
        } else {
            currentBet = parseInt(this.dataset.amount);
        }
        customBetInput.value = currentBet;
        validateBet();
    });
});

// Проверка ставки
function validateBet() {
    currentBet = Math.max(10, Math.min(currentBet, balance));
    customBetInput.value = currentBet;
}

// В функции spinWheel() замените проверку ставки на:
if (currentBet < 10 || currentBet > balance) {
    alert(`Минимальная ставка: 10✨\nМаксимальная: ${balance}✨`);
    return false;
}

// Кручение рулетки
function spinWheel() {
    if (isSpinning) return;
    if (currentBet <= 0 || currentBet > balance) {
        alert('Недостаточно средств!');
        return;
    }
    if (!currentMultiplier) {
        alert('Выберите множитель!');
        return;
    }

    balance -= currentBet;
    updateUI();
    isSpinning = true;
    document.getElementById('spin-btn').disabled = true;

    const wheel = document.getElementById('wheel');
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';
    resultDiv.className = 'result';

    // Анимация вращения
    const spinDuration = 3000 + Math.random() * 2000;
    const spins = 5 + Math.random() * 3;
    const degrees = spins * 360 + Math.random() * 360;

    wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
    wheel.style.transform = `rotate(${degrees}deg)`;

    // Определение результата
    setTimeout(() => {
        const normalizedDeg = degrees % 360;
        const sectorAngle = 360 / wheelNumbers.length;
        const winningIndex = Math.floor((360 - normalizedDeg) / sectorAngle) % wheelNumbers.length;
        const winningNumber = wheelNumbers[winningIndex];

        // Проверка выигрыша
        let win = false;
        let winAmount = 0;

        if (currentMultiplier === 50 && winningNumber.color === 'green') {
            win = true;
            winAmount = currentBet * 50;
        }
        else if (currentMultiplier === 5 && winningNumber.color !== 'green' && winningNumber.number % 2 === 0) {
            win = true;
            winAmount = currentBet * 5;
        }
        else if (currentMultiplier === 3 && winningNumber.color !== 'green' && winningNumber.number % 3 === 0) {
            win = true;
            winAmount = currentBet * 3;
        }
        else if (currentMultiplier === 2 && winningNumber.color !== 'green' && winningNumber.number % 2 !== 0) {
            win = true;
            winAmount = currentBet * 2;
        }

        if (win) {
            balance += winAmount;
            resultDiv.textContent = `🎉 Вы выиграли ${winAmount}✨ (${winningNumber.number})`;
            resultDiv.classList.add('win');
        } else {
            resultDiv.textContent = `😢 Выпало: ${winningNumber.number}`;
            resultDiv.classList.add('lose');
        }

        updateUI();
        isSpinning = false;
        document.getElementById('spin-btn').disabled = false;

        // Сброс анимации
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = `rotate(${degrees % 360}deg)`;
            setTimeout(() => wheel.style.transition = 'transform 3000ms cubic-bezier(0.1, 0.7, 0.1, 1)');
        }, 100);
    }, spinDuration);
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    initWheel();
    updateUI();

    // Обработчики кнопок
    document.getElementById('decrease-bet').addEventListener('click', () => changeBet(-10));
    document.getElementById('increase-bet').addEventListener('click', () => changeBet(10));
    document.getElementById('max-bet').addEventListener('click', setMaxBet);

    document.querySelectorAll('.step-btn').forEach(btn => {
        if (btn.id !== 'max-bet') {
            btn.addEventListener('click', () => changeBet(parseInt(btn.dataset.step)));
        }
    });

    document.querySelectorAll('.multiplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentMultiplier = parseInt(this.dataset.multiplier);
            document.querySelectorAll('.multiplier-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('spin-btn').addEventListener('click', spinWheel);

    // Вероятности (0.5% на зеленое)
    wheelNumbers.forEach(num => {
        if (num.color === 'green') {
            num.weight = 0.5;
        } else if (num.color === 'red') {
            num.weight = 49.75;
        } else {
            num.weight = 49.75;
        }
    });
});
