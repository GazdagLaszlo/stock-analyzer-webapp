const InvestorStatistics = () => {
  return (
    <div>
      <h4>Hozammérés</h4>
      <ul>
        <li>Abszolút hozam – mennyit kerestem forintban/dollárban</li>
        <li>Százalékos hozam – pl. +12% egy év alatt</li>
        <li>
          Time-weighted return (TWR) – kiszűri a be/kifizetések torzító hatását,
          így valóban a befektetési döntések hozamát méri
        </li>
        <li>
          Benchmark összehasonlítás – vertem-e az S&amp;P 500-at, vagy csak a
          piac vitt magával
        </li>
      </ul>
      <br />
      <br />

      <h4>Kockázat–hozam mutatók</h4>
      <ul>
        <li>Sharpe-ráta – egységnyi kockázatért mennyi hozamot kaptam?</li>
        <li>Béta – mennyire mozog együtt a portfólióm a piaccal?</li>
        <li>Alfa – a piaci mozgáson felül mennyit termelt a portfólió?</li>
        <li>
          Max drawdown – mekkora volt a legnagyobb csúcstól völgyig tartó
          visszaesés?
        </li>
        <li>Volatilitás – mennyire ingadozik a portfólió értéke?</li>
      </ul>

      <br />
      <br />
      <h4>Portfólió összetétel értékelése</h4>
      <ul>
        <li>
          Diverzifikáció – nem vagyok-e túlságosan egy szektorban/részvényben?
        </li>
        <li>Eszközosztály-arányok – részvény, kötvény, készpénz egyensúlya</li>
        <li>Értékeltség – a portfólió átlagos P/E és P/B mutatói</li>
      </ul>
    </div>
  );
};

export default InvestorStatistics;
