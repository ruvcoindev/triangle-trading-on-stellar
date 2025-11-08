# Stellar Tri-Arbitrage Finder

A sophisticated tool to identify and execute triangular arbitrage opportunities on the Stellar blockchain. This application connects to the live Stellar network (Mainnet or Testnet), fetches real-time order book data, and facilitates atomic trades through the secure Freighter wallet extension.

---

## English Instructions

### ⚠️ Important Disclaimer
**Trading cryptocurrencies involves significant risk.** Market volatility, network fees, and "slippage" (price changes that occur between submitting a transaction and its execution) can all affect the final outcome of a trade.

- This tool is provided for educational and experimental purposes.
- **Always start on the Testnet** to familiarize yourself with the application's behavior before using real assets.
- The developers of this tool are not responsible for any financial losses.

### Features
- **Live Market Data**: Fetches real-time order book data from the Stellar network.
- **Secure Trading**: Integrates with the **Freighter** wallet extension. Your secret keys never leave the wallet.
- **Mainnet & Testnet**: A network switcher allows for safe testing before real trading.
- **Atomic Transactions**: Arbitrage trades are bundled into a single transaction. If any part of the 3-leg trade fails, the entire transaction is reverted, protecting you from partial, unprofitable trades.
- **Real-time Refresh**: Automatically refreshes opportunity data every 15 seconds to stay current with the market.

### User Guide

**1. Prerequisites**
- You must have the [Freighter](https://www.freighter.app/) wallet browser extension installed.
- You need an active Stellar account with a small amount of XLM to cover transaction fees. For the Testnet, you can get free test XLM from the [Stellar Laboratory Faucet](https://laboratory.stellar.org/#account-creator?network=test).

**2. Connect Your Wallet**
- Click the **"Connect Wallet"** button in the top-right corner.
- Approve the connection request in the Freighter pop-up. Your public key will appear in the header.

**3. Select Network**
- In the "Trade Configuration" panel, choose between **Testnet** and **Mainnet**.
- It is strongly recommended to start with the Testnet.

**4. Configure and Find Opportunities**
- **Starting Asset**: Select the asset you want to start and end with (e.g., XLM, USDC).
- **Investment Amount**: Enter the amount of the starting asset you wish to trade.
- Click **"Find Opportunities"**. The application will scan the markets for profitable 3-asset trading paths.

**5. Analyze and Preview**
- Profitable paths will be displayed as cards on the right, sorted by the highest potential profit.
- Each card shows the path, the estimated profit percentage, and the absolute profit.
- Click **"Preview & Execute"** on an opportunity to see a detailed step-by-step breakdown.

**6. Execute the Trade**
- In the "Trade Preview" panel, review the steps and the expected outcome.
- If you wish to proceed, click the red **"Execute Trade"** button.
- A confirmation pop-up from Freighter will appear. **Review the transaction details carefully** within the wallet.
- Approve the transaction in Freighter to submit it to the Stellar network.
- A success or error message will appear at the top of the page with a link to the transaction on a block explorer.

### Developer Guide (Running Locally)

**1. Prerequisites**
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

**2. Setup**
- Download or clone the project files to your local machine.

**3. Install Dependencies**
- Open a terminal in the project's root directory and run:
  ```bash
  npm install
  ```

**4. Run the Development Server**
- To start the app in development mode with hot-reloading, run:
  ```bash
  npm run dev
  ```
- Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

**5. Build for Production**
- To create an optimized static build of the application, run:
  ```bash
  npm run build
  ```
- The production-ready files will be located in the `dist/` directory. You can serve these files with any static file server.

---

## Инструкции на русском языке

### ⚠️ Важное замечание
**Торговля криптовалютами сопряжена со значительным риском.** Волатильность рынка, сетевые комиссии и "проскальзывание" (изменение цены в промежутке между отправкой транзакции и ее исполнением) могут повлиять на конечный результат сделки.

- Этот инструмент предоставляется в образовательных и экспериментальных целях.
- **Всегда начинайте с Testnet (тестовой сети)**, чтобы ознакомиться с поведением приложения, прежде чем использовать реальные активы.
- Разработчики этого инструмента не несут ответственности за любые финансовые потери.

### Основные возможности
- **Данные с рынка в реальном времени**: Получает актуальные данные из книг ордеров сети Stellar.
- **Безопасная торговля**: Интеграция с расширением-кошельком **Freighter**. Ваши секретные ключи никогда не покидают кошелек.
- **Mainnet и Testnet**: Переключатель сетей позволяет безопасно тестировать стратегии.
- **Атомарные транзакции**: Арбитражные сделки объединяются в одну транзакцию. Если какая-либо из трех частей сделки завершится неудачно, вся транзакция будет отменена, что защищает от частичных, убыточных сделок.
- **Обновление в реальном времени**: Автоматически обновляет данные о возможностях каждые 15 секунд, чтобы соответствовать рынку.

### Руководство пользователя

**1. Предварительные требования**
- У вас должно быть установлено браузерное расширение-кошелек [Freighter](https://www.freighter.app/).
- Вам понадобится активный аккаунт Stellar с небольшим количеством XLM для покрытия комиссий за транзакции. Для тестовой сети (Testnet) вы можете получить бесплатные тестовые XLM через [кран (faucet) Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).

**2. Подключите кошелек**
- Нажмите на кнопку **"Connect Wallet"** в правом верхнем углу.
- Подтвердите запрос на подключение во всплывающем окне Freighter. Ваш публичный ключ появится в заголовке.

**3. Выберите сеть**
- В панели "Trade Configuration" выберите между **Testnet** и **Mainnet**.
- Настоятельно рекомендуется начинать с Testnet.

**4. Настройте и найдите возможности**
- **Starting Asset**: Выберите актив, с которого вы хотите начать и которым хотите закончить торговую цепочку (например, XLM, USDC).
- **Investment Amount**: Введите количество исходного актива, которое вы хотите использовать.
- Нажмите **"Find Opportunities"**. Приложение начнет сканировать рынки в поиске прибыльных торговых путей из трех активов.

**5. Анализируйте и просматривайте**
- Прибыльные пути будут отображены в виде карточек справа, отсортированных по наибольшей потенциальной прибыли.
- Каждая карточка показывает путь, ожидаемую прибыль в процентах и в абсолютном значении.
- Нажмите **"Preview & Execute"** на одной из возможностей, чтобы увидеть детальную пошаговую разбивку.

**6. Исполните сделку**
- В панели "Trade Preview" просмотрите шаги и ожидаемый результат.
- Если вы хотите продолжить, нажмите красную кнопку **"Execute Trade"**.
- Появится всплывающее окно от Freighter для подтверждения. **Внимательно проверьте детали транзакции** в кошельке.
- Подтвердите транзакцию в Freighter, чтобы отправить ее в сеть Stellar.
- Вверху страницы появится сообщение об успехе или ошибке со ссылкой на транзакцию в обозревателе блоков.

### Руководство для разработчика (Локальный запуск)

**1. Предварительные требования**
- [Node.js](https://nodejs.org/) (версия 18 или выше)
- [npm](https://www.npmjs.com/) или [yarn](https://yarnpkg.com/)

**2. Установка**
- Скачайте или клонируйте файлы проекта на свой компьютер.

**3. Установка зависимостей**
- Откройте терминал в корневой папке проекта и выполните команду:
  ```bash
  npm install
  ```

**4. Запуск сервера для разработки**
- Чтобы запустить приложение в режиме разработки с автоматической перезагрузкой, выполните:
  ```bash
  npm run dev
  ```
- Откройте браузер и перейдите по локальному URL-адресу (обычно `http://localhost:5173`).

**5. Сборка для продакшена**
- Чтобы создать оптимизированную статическую сборку приложения, выполните:
  ```bash
  npm run build
  ```
- Готовые для развертывания файлы будут находиться в директории `dist/`. Вы можете разместить их на любом статическом хостинге.
