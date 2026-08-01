# Spaar Projecties 📈

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/parvenuprompting/spaarprojecties/pulls)

Een minimalistische, snelle en type-safe React TypeScript webapplicatie voor het berekenen van realtime spaarprojecties met maandelijks samengestelde rente, eenmalig startkapitaal, cumulatieve uitgavenberekening en spaardoelberekeningen.

![Spaar Projecties Overview](./public/banner.png)

## 🚀 Kenmerken

- **Eenmalig Startkapitaal (Optioneel)**: Voer aanwezig spaargeld in (bijv. €1.000) dat direct meegroeit met de samengestelde rente en correct als inleg wordt toegerekend.
- **Exacte Stortingstiming**: Maandelijks samengestelde rente conform financiële standaarden, met exacte stortingsmomenten voor wekelijks, maandelijks, per kwartaal en jaarlijks sparen.
- **Sticky Navigatiemenu**: Snel en soepel navigeren naar elk onderdeel van de pagina met een responsief mobiel hamburger-menu.
- **Dual Modus (Sparen vs. Uitgaven)**:
  - 💰 **Sparen & Investeren**: Met maandelijks samengestelde rente (rendement).
  - 🧾 **Uitgaven & Kosten**: Bereken de totale cumulatieve kosten van abonnementen/vaste gewoontes over tijd (zonder rente).
- **Target Calculator (Spaardoel)**: Voer je gewenste eindbedrag en spaartermijn in om direct te berekenen hoeveel je periodiek opzij moet zetten.
- **Aangepaste Realtime Berekening**: Reken in realtime een eigen specifiek bedrag, inlegfrequentie en exact aantal jaren of maanden uit.
- **LocalStorage Persistentie**: Laatst ingevoerde gegevens worden automatisch lokaal opgeslagen in je browser.
- **Flexibele Rente Slider**: Pas het verwachte rendement eenvoudig aan tussen **0% en 10%**.
- **4 Spaarfrequenties & 15 Tijdsperiodes**: Van 1 week t/m 50 jaar (inclusief 20j, 25j, 30j, 35j, 45j en 50j mijlpalen).
- **Sticky Matrix Tabel**: Mobiel-vriendelijke tabel met vastgezette eerste kolom (tijdsperiode) tijdens horizontaal scrollen.
- **Volledige Toegankelijkheid (a11y)**: Alle interactieve kaarten en tabelkoppen zijn volledig met het toetsenbord te bedienen.
- **100% Offline & Veilig**: Pure client-side applicatie zonder externe database of server calls (100% privacy).

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
