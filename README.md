[![Code Climate](https://codeclimate.com/github/Chropez/JournalenCoon/badges/gpa.svg)](https://codeclimate.com/github/Chropez/JournalenCoon)

# JournalenCoon
Coonify your Journalen experience!

# Installation
1. Installera git, nodejs och bower.
2. Öppna ett commandfönster och skriv
    ```bash
    git clone https://github.com/Chropez/JournalenCoon.git && cd JournalenCoon
    ```
4. Kör:
    ```bash
    npm install && bower install
    ```
5. I Chrome, öppna chrome://extensions/
6. Klicka i Developer Mode
7. Klicka Load unpacked extension
8. Välj JournalenCoon mappen
9. Använd git för att checka in ändringarna

# Release
1. Du måste ha ett Chrome Web Store Developer konto.
2. Öppna ett commandfönster och skriv
  ```bash
  npm run build
  ```
3. Gå till katalogen dist, där finns JournalenCoon.zip som ska laddas upp på Chrome Web Store
