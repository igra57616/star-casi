// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

let balance = 1000; // Стартовый баланс

// Обновляем отображение баланса
function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

// Игра "Слоты"
function playSlots() {
    if (balance < 50) {
        alert("Недостаточно звёзд! Минимальная ставка: 50⭐️");
        return;
    }

    balance -= 50; // Списываем ставку
    updateBalance();

    // Рандомный выигрыш (40% шанс)
    const isWin = Math.random() < 0.4;
    
    if (isWin) {
        const winAmount = Math.floor(Math.random() * 150) + 50; // Выигрыш 50-200⭐️
        balance += winAmount;
        alert(`🎉 Вы выиграли ${winAmount} звёзд!`);
    } else {
        alert("❌ Повезёт в следующий раз!");
    }

    updateBalance();
}

// Игра "Кости" (аналогично можно дописать)
function playDice() {
    alert("В разработке! Используйте слоты 🎰");
}
