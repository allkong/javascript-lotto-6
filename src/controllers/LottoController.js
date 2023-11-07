import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import LottoData from '../models/LottoData.js';
import Lotto from '../Lotto.js';

class LottoController {
  constructor() {
    this.inputView = new InputView();
    this.outputView = new OutputView();
    // this.lottoData;
  }

  async lottoProcess() {
    await this.inputPurchaseAmount();
    this.buyLottos();
    await this.inputWinningNumber();
    await this.inputBonusNumber();
    this.compareLottos();
  }

  async inputPurchaseAmount() {
    const amount = await this.inputView.purchaseAmount();
    try {
      this.lottoData = new LottoData(amount);
      return this.lottoData;
    } catch (error) {
      this.outputView.printError(error.message);
      return this.inputPurchaseAmount();
    }
  }

  buyLottos() {
    const { count, lottos } = this.lottoData.lottoIssuance();
    this.outputView.printLottos(count, lottos);
  }

  async inputWinningNumber() {
    const winning = await this.inputView.winningNumber();
    try {
      this.lotto = new Lotto(winning.split(',').map(Number));
      return this.lotto;
    } catch (error) {
      this.outputView.printError(error.message);
      return this.inputWinningNumber();
    }
  }

  async inputBonusNumber() {
    const bonus = await this.inputView.bonusNumber();
    try {
      this.lotto.setBonusNumber(Number(bonus));
      return this.lotto;
    } catch (error) {
      this.outputView.printError(error.message);
      return this.inputBonusNumber();
    }
  }

  compareLottos() {
    const lottos = this.lottoData.getLottos();
    const winningNumber = this.lotto.getWinningNumber();
    const bonusNumber = this.lotto.getBonusNumber();
    const lottoStats = this.calculateStats(lottos, winningNumber, bonusNumber);
    this.outputView.printStats(lottoStats);
  }

  calculateStats(lottos, winningNumber, bonusNumber) {
    const lottoStats = { 3: 0, 4: 0, 5: 0, 6: 0, bonus: 0 };

    lottos.forEach((lotto) => {
      const winningCount = lotto.filter((number) => winningNumber.includes(number)).length;
      const bonusCount = lotto.includes(bonusNumber);

      if (winningCount === 5 && bonusCount) {
        lottoStats.bonus += 1;
      } else if (winningCount in lottoStats) {
        lottoStats[winningCount] += 1;
      }
    });
    return lottoStats;
  }
}

export default LottoController;
