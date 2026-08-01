# Spaarprojecties 📈

Een minimalistische, snelle en type-safe React TypeScript webapplicatie voor het berekenen van realtime spaarprojecties met maandelijks samengestelde rente.

![Spaarprojecties Overview](https://raw.githubusercontent.com/parvenuprompting/spaarprojecties/main/public/og-preview.png)

## 🚀 Kenmerken

- **Realtime Berekening**: Voer een periodiek spaarbedrag in en zie het dashboard direct bijwerken.
- **Samengestelde Rente (Compound Interest)**: Standaard ingesteld op 3,0% per jaar (maandelijks samengesteld conform financiële standaarden).
- **Flexibele Rente Slider**: Pas de verwachte rente/rendement eenvoudig aan tussen **0% en 10%**.
- **4 Spaarfrequenties**: Vergelijk sparen op **Wekelijkse**, **Maandelijkse**, **Per Kwartaal** en **Jaarlijkse** basis.
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
