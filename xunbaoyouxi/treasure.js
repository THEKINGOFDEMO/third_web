class TreasureMap {
  static getInitialClue() {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve("在古老的图书馆里找到了第一个线索...");
          }, 1000);
      });
  }

  static decodeAncientScript(clue) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              if (!clue) {
                  reject("没有线索可以解码!");
              }
              resolve("解码成功!宝藏在一座古老的神庙中...");
          }, 1500);
      });
  }

  static searchTemple(location) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const random = Math.random();
              if (random < 0.5) {
                  reject("糟糕!遇到了神庙守卫!");
              }
              resolve("找到了一个神秘的箱子...");
          }, 2000);
      });
  }

  static openTreasureBox() {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve("恭喜!你找到了传说中的宝藏!");
          }, 1000);
      });
  }
}

async function findTreasureWithAsync() {
  try {
      const clue = await TreasureMap.getInitialClue();
      console.log(clue);

      const location = await TreasureMap.decodeAncientScript(clue);
      console.log(location);

      const box = await TreasureMap.searchTemple(location);
      console.log(box);

      const treasure = await TreasureMap.openTreasureBox();
      console.log(treasure);
  } catch (error) {
      console.error("任务失败:", error);
  }
}

findTreasureWithAsync();
