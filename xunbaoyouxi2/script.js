
class TreasureMap {
    // 获取线索
    static getClue(step) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const clues = [
                    "在古老的图书馆里找到了一个新的线索...",
                    "在神秘的洞穴中发现了一些古老的文字...",
                    "在隐秘的森林中找到了一个失落的卷轴..."
                ];
                resolve(clues[step % clues.length]); // 根据步骤索引返回线索
            }, 1000);
        });
    }

    // 解码线索
    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!"); // 错误处理
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }

    // 搜索神庙
    static searchTemple(location) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.5) {
                    reject("糟糕!遇到了神庙守卫!"); // 错误处理
                }
                resolve("找到了一个神秘的箱子...");
            }, 2000);
        });
    }

    // 打开宝箱
    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }
}

let step = 0; // 游戏步数

// 保存玩家信息到 localStorage
function savePlayerInfo(playerId, nickname, history) {
    const playerInfo = { playerId, nickname, history };
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
}

// 从 localStorage 中加载玩家信息
function loadPlayerInfo() {
    const playerInfo = localStorage.getItem('playerInfo');
    return playerInfo ? JSON.parse(playerInfo) : null;
}
function showPlayerInfo() {
    document.getElementById('playerInfoContainer').style.display = 'flex'; // 显示玩家输入框
}

function hidePlayerInfo() {
    document.getElementById('playerInfoContainer').style.display = 'none'; // 隐藏玩家输入框
}
// 显示和隐藏游戏元素
function showGameElements() {
    document.getElementById('log').style.display = 'block';
    document.getElementById('treasureContainer').style.display = 'block';
    document.getElementById('pokedexButton').style.display = 'block';
}

function hideGameElements() {
    document.getElementById('log').style.display = 'none';
    document.getElementById('treasureContainer').style.display = 'none';
    document.getElementById('pokedexButton').style.display = 'none';
}
// 显示历史记录消息
function displayLogMessages(history) {
    const log = document.getElementById('log');
    history.forEach(message => {
        logMessage(message);
    });
}

// 显示消息
function logMessage(message) {
    const log = document.getElementById('log');
    const div = document.createElement('div');
    div.className = 'message';
    div.textContent = message; // 消息内容
    log.appendChild(div);
    setTimeout(() => div.classList.add('visible'), 100); // 添加可见性
}

// 开始寻宝
async function startTreasureHunt() {
    const log = document.getElementById('log');
    const treasureContainer = document.getElementById('treasureContainer');
    treasureContainer.innerHTML = ''; // 清空宝箱区域

    try {
        const clue = await TreasureMap.getClue(step);
        logMessage(clue); // 显示线索
        recordGameHistory(clue);

        const decodedClue = await TreasureMap.decodeAncientScript(clue);
        logMessage(decodedClue); // 显示解码结果
        recordGameHistory(decodedClue);

        const location = await TreasureMap.searchTemple(decodedClue);
        logMessage(location); // 显示搜索结果
        recordGameHistory(location);

        initializeTreasureBoxes(); // 初始化宝箱
    } catch (error) {
        logMessage(error + " 但别灰心，继续探索新的区域..."); // 错误提示
        recordGameHistory(error);
        step++; // 增加步骤
        setTimeout(startTreasureHunt, 2000); // 重试
    }
}

// 初始化宝箱
function initializeTreasureBoxes() {
    const treasureContainer = document.getElementById('treasureContainer');
    const boxes = ['empty', 'empty', 'treasure'].sort(() => Math.random() - 0.5); // 随机宝箱状态

    boxes.forEach(status => {
        const box = document.createElement('div');
        box.className = 'treasure-box';
        box.style.backgroundImage = "url('images/closed.png')"; // 设置宝箱图片
        box.addEventListener('click', async () => {
            if (box.style.backgroundImage.includes('closed')) { // 检查是否已被打开
                box.style.backgroundImage = status === "treasure" ? "url('open_treasure.png')" : "url('open_empty.png')";
                logMessage(status === "treasure" ? await TreasureMap.openTreasureBox() : "宝箱是空的! 继续寻找下一个线索...");
                recordGameHistory(status === "treasure" ? "找到了宝藏!" : "宝箱是空的!");
                disableAllBoxes(); // 禁用所有宝箱交互
                setTimeout(() => {
                    treasureContainer.innerHTML = ''; // 清空宝箱区域
                    if (status !== "treasure") {
                        step++; // 增加步骤
                        startTreasureHunt(); // 继续寻找
                    }
                }, 1000);
            }
        });
        treasureContainer.appendChild(box); // 添加宝箱到容器
    });
}

// 禁用所有宝箱的交互
function disableAllBoxes() {
    const boxes = document.querySelectorAll('.treasure-box');
    boxes.forEach(box => box.style.cursor = 'default'); // 改变鼠标样式
}

// 记录游戏历史
function recordGameHistory(message) {
    const playerInfo = loadPlayerInfo();
    if (playerInfo) {
        playerInfo.history.push(message);
        savePlayerInfo(playerInfo.playerId, playerInfo.nickname, playerInfo.history); // 保存历史
    }
}

// 播放背景音乐
function playBackgroundMusic() {
    const music = document.getElementById('backgroundMusic');
    music.play(); // 播放音乐
}

// 检查玩家信息
function checkPlayerInfo(playerId, nickname) {
    const playerInfo = loadPlayerInfo();
    
    if (playerInfo) {
        // 只有在存在用户信息的情况下才进行比较和询问
        if (playerInfo.playerId === playerId && playerInfo.nickname === nickname) {
            const userChoice = confirm(`欢迎回来，${playerInfo.nickname}！您想继续上次的游戏吗？ (点击 "取消" 以重启游戏)`);
            if (userChoice) {
                step = playerInfo.history.length; // 恢复历史记录步数
                displayLogMessages(playerInfo.history); // 显示历史
                return true; // 继续游戏
            } else {
                // 用户选择不继续，重置历史
                savePlayerInfo(playerId, nickname, []); // 重置历史记录
                step = 0; // 确保步骤重新初始化
                return false; // 重启游戏
            }
        }
    }
    return false; // 没有玩家信息或不匹配，开始新的游戏
}
// 处理玩家信息设定
function handlePlayerInfoSet() {
    startGame();
    const playerId = document.getElementById('playerId').value;
    const nickname = document.getElementById('nickname').value;
    
    const shouldContinue = checkPlayerInfo(playerId, nickname);
    if (!shouldContinue) {
        // 如果没有找到有效的玩家记录，保存新的玩家信息并开始新游戏
        savePlayerInfo(playerId, nickname, []); // 保存新玩家信息
        hidePlayerInfo(); 
        showGameElements(); // 显示游戏元素
        startTreasureHunt(); // 启动新的游戏
    } else {
        // 如果找到了有效记录，直接继续游戏
        hidePlayerInfo(); // 隐藏输入框
        showGameElements(); // 显示游戏元素
        startTreasureHunt(); // 继续游戏
    }
}

// 开始游戏
function startGame() {
    playBackgroundMusic();
    // 游戏已经在 handlePlayerInfoSet 中处理
}


// 点击事件监听器
document.getElementById('setPlayerInfoButton').addEventListener('click', handlePlayerInfoSet);
document.getElementById('startButton').addEventListener('click', startGame);
// 加载图鉴数据
async function loadPokedexData() {
    try {
        const response = await fetch('data.txt'); // 获取数据文件
        const text = await response.text(); // 读取文本
        const entries = text.split('\n').map(line => {
            const [name, description, image] = line.split(': '); // 分割数据
            return { name: name.trim(), description: description.trim(), image: image.trim() }; // 构建数据对象
        });
        return entries; // 返回条目数组
    } catch (error) {
        console.error('Error loading Pokedex data:', error); // 处理错误
        return [];
    }
}

// 显示图鉴
function showPokedex() {
    const pokedex = document.getElementById('pokedex');
    const pokedexContent = document.getElementById('pokedexContent');
    const pokedexMenu = document.getElementById('pokedexMenu');
    const pokedexMenuContainer = document.getElementById('pokedexMenuContainer');

    pokedexContent.innerHTML = ''; // 清空内容
    pokedexMenu.innerHTML = ''; // 清空菜单

    pokedexMenuContainer.style.display = 'block'; // 显示菜单
    pokedexContent.style.display = 'none'; // 隐藏内容

    loadPokedexData().then(entries => {
        entries.forEach((entry, index) => {
            const menuItem = document.createElement('li'); // 创建菜单项
            menuItem.innerHTML = `<a href="#" onclick="showPokedexEntry(${index})">${entry.name}</a>`;
            pokedexMenu.appendChild(menuItem); // 添加到菜单中
        });
    });

    pokedex.style.display = 'block'; // 显示图鉴
}

// 显示图鉴中的单个条目
function showPokedexEntry(index) {
    loadPokedexData().then(entries => {
        const entry = entries[index];
        const pokedexContent = document.getElementById('pokedexContent');
        const pokedexMenuContainer = document.getElementById('pokedexMenuContainer');
        pokedexContent.innerHTML = `<h3>${entry.name}</h3><p>${entry.description}</p><img src="${entry.image}" alt="${entry.name}">`;
        pokedexMenuContainer.style.display = 'none'; // 隐藏菜单
        pokedexContent.style.display = 'block'; // 显示内容
    });
}

// 点击事件监听器
document.getElementById('pokedexButton').addEventListener('click', showPokedex);
document.getElementById('closePokedexButton').addEventListener('click', () => {
    document.getElementById('pokedex').style.display = 'none'; // 隐藏图鉴
});

// 页面加载时显示玩家信息输入框
document.addEventListener('DOMContentLoaded', () => {
    const playerInfo = loadPlayerInfo();
    
    if (!playerInfo) {
        showPlayerInfo(); // 只在没有玩家信息时显示
    } else {
        // 如果有玩家信息，继续游戏逻辑可以通过输入 ID 和昵称而决定
    }
});