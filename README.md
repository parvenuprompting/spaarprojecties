# Spaarprojecties 📈

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/parvenuprompting/spaarprojecties/pulls)

Een minimalistische, snelle en type-safe React TypeScript webapplicatie voor het berekenen van realtime spaarprojecties met maandelijks samengestelde rente én cumulatieve uitgavenberekening.

![Spaarprojecties Overview](https://raw.githubusercontent.com/parvenuprompting/spaarprojecties/main/public/banner.png)

## 🚀 Kenmerken

- **Dual Modus (Sparen vs. Uitgaven)**:
  - 💰 **Sparen & Investeren**: Met maandelijks samengestelde rente (rendement).
  - 🧾 **Uitgaven & Kosten**: Bereken de totale cumulatieve kosten van abonnementen/vaste gewoontes over tijd (zonder rente).
- **Realtime Berekening**: Voer een bedrag in en het hele dashboard past zich direct aan.
- **Samengestelde Rente (Compound Interest)**: Standaard ingesteld op 3,0% per jaar (maandelijks samengesteld conform financiële standaarden).
- **Flexibele Rente Slider**: Pas het verwachte rendement eenvoudig aan tussen **0% en 10%**.
- **4 Spaarfrequenties**: Vergelijk bedragen op **Wekelijkse**, **Maandelijkse**, **Per Kwartaal** en **Jaarlijkse** basis.
- **12 Tijdsperiodes**: Van kort (1 week, 1 maand, 3/6 maanden, 1/2/5 jaar) tot langetermijn (10, 15, 20, 30 en maximaal 50 jaar).
- **Lange Termijn Highlights**: Accentkaarten voor de mijlpalen van 20, 30 en 50 jaar met het % rendementsbonus t.o.v. de eigen inleg.
- **Interactieve Recharts Grafiek**: Visuele representatie van eigen inleg versus opgebouwde samengestelde rente over tijd.
- **Matrix Tabel**: Compleet overzicht van alle termijnen x frequenties met filters voor Totale Waarde, Rente of Inleg.
- **Bank-Style UI**: Strak, professioneel, minimalistisch design met rustige typografie en bank-blauwe accenten.
- **100% Offline & Veilig**: Pure client-side applicatie zonder externe database of server calls.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Design tokens, flexbox/grid layout)
- **Visualisatie**: Recharts
- **Iconen**: Lucide React
- **Testing**: Vitest + React Testing Library

## 📦 Installatie & Lokaal Draaien

1. **Repository klonen**:
   ```bash
   git clone https://github.com/parvenuprompting/spaarprojecties.git
   cd spaarprojecties
   ```

2. **Dependencies installeren**:
   ```bash
   npm install
   ```

3. **Development server starten**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in je browser.

4. **Unit tests uitvoeren**:
   ```bash
   npm test
   ```

5. **Productie build maken**:
   ```bash
   npm run build
   ```

## 📐 Samengestelde Rente Formule

De applicatie maakt gebruik van de financiële standaard voor maandelijks samengestelde rente:

$$r_{\text{maand}} = \frac{r_{\text{jaar}}}{12}$$

Voor elke maand $m$:
$$\text{Saldo}_m = (\text{Saldo}_{m-1} + \text{Inleg}_m) \times (1 + r_{\text{maand}})$$

## 📄 Licentie

MIT License
