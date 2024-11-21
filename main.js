// 获取按钮和输入框
const drawButton = document.getElementById('draw-button');
const startInput = document.getElementById('start-id');
const endInput = document.getElementById('end-id');
const resultDiv = document.getElementById('result');
const randomIdSpan = document.getElementById('random-id');

// 错误次数计数（从 error.js 控制）
let errorCount = 0;

// 主逻辑
// 平滑减速函数：狠一点的减速曲线
function sharpEaseOut(t) {
    return 1 - Math.pow(1 - t, 5); // 调整幂次（5）让减速更明显
}

// 抽号动画逻辑
function animateDrawing(start, end, finalNumber, callback) {
    let currentNumber = start; // 当前滚动数字
    const totalCircles = 2; // 完整滚动的圈数
    const totalNumbers = (end - start + 1) * (totalCircles + 1); // 总滚动数字数量
    let currentStep = 0; // 当前滚动的步数
    const totalTime = 2000; // 动画总时长（2秒）
    const baseInterval = 20; // 最快滚动时的时间间隔

    function update() {
        currentStep++;
        const progress = Math.min(currentStep / totalNumbers, 1); // 动画进度 (0 ~ 1)
        const intervalTime =
            progress < 0.9 // 前 90% 逐渐减速
                ? baseInterval
                : baseInterval + sharpEaseOut((progress - 0.9) / 0.1) * 80;

        // 更新学号
        currentNumber = currentNumber < end ? currentNumber + 1 : start;
        randomIdSpan.textContent = `有请幸运观众 ${currentNumber}~`;

        // 判断是否到达最终数字
        if (currentStep >= totalNumbers && currentNumber === finalNumber) {
            randomIdSpan.textContent = `有请幸运观众 ${finalNumber}~`; // 最终学号
            if (callback) callback(); // 动画完成回调
        } else {
            setTimeout(update, intervalTime); // 下一帧
        }
    }

    update(); // 启动动画
}

// 修改抽号逻辑，加入动画
drawButton.addEventListener('click', () => {
    const start = parseInt(startInput.value);
    const end = parseInt(endInput.value);

    if (!startInput.value || !endInput.value) {
        showError("你根本就没输东西你抽啥呀?!");
        return;
    }

    if (isNaN(start) || isNaN(end) || start < 1 || end > 50 || start > end) {
        errorCount++;
        handleError(errorCount, start, end);
        return;
    }

    errorCount = 0;
    hideError();

    const fairMode = document.getElementById('fair-mode').checked;
    let randomId;

    if (fairMode) {
        // 公平模式下，从未被抽中的学号中选择
        const availableIds = [];
        for (let i = start; i <= end; i++) {
            if (!exemptedIds.has(i)) availableIds.push(i);
        }

        if (availableIds.length === 0) {
            showError("所有学号都已经抽过啦！");
            return;
        }

        randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
        exemptedIds.add(randomId); // 更新免抽学号列表
    } else {
        // 非公平模式下，直接随机抽取
        randomId = Math.floor(Math.random() * (end - start + 1)) + start;
    }

    updateRules(); // 更新规则显示（仅在公平模式下有效）
    saveState(); // 保存当前状态

    // 动画显示结果
    animateDrawing(start, end, randomId, () => {
        console.log(`最终学号：${randomId}`);
    });
});

// 初始化免抽学号集合
let exemptedIds = new Set();

// 获取规则显示容器
const fairModeRules = document.getElementById('fair-mode-rules');
const exemptedIdsContainer = document.getElementById('exempted-ids');

// 点击问号，显示规则和免抽学号
document.querySelector('.info-icon').addEventListener('click', () => {
    // 更新免抽学号列表
    const idsArray = Array.from(exemptedIds).sort((a, b) => a - b);
    exemptedIdsContainer.innerHTML = idsArray.length
        ? `免抽学号：${idsArray.map(id => `<span>${id}</span>`).join(', ')}`
        : '当前没有免抽学号。';

    // 显示规则容器
    fairModeRules.style.display = 'block';
});

// 修改随机抽取逻辑以支持公平模式
drawButton.addEventListener('click', () => {
    const start = parseInt(startInput.value);
    const end = parseInt(endInput.value);

    if (!startInput.value || !endInput.value) {
        showError("你根本就没输东西你抽啥呀?!");
        return;
    }

    if (isNaN(start) || isNaN(end) || start < 1 || end > 50 || start > end) {
        errorCount++;
        handleError(errorCount, start, end);
        return;
    }

    errorCount = 0;
    hideError();

    // 生成公平模式的随机学号
    let randomId;
    const fairMode = document.getElementById('fair-mode').checked;
    if (fairMode) {
        const availableIds = [];
        for (let i = start; i <= end; i++) {
            if (!exemptedIds.has(i)) availableIds.push(i);
        }
        if (availableIds.length === 0) {
            showError("所有学号都已经抽过啦！");
            return;
        }
        randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
    } else {
        randomId = Math.floor(Math.random() * (end - start + 1)) + start;
    }

    // 更新免抽学号集合
    exemptedIds.add(randomId);
    updateRules();
    saveState(); // 保存状态

    // 显示结果
    randomIdSpan.textContent = `有请幸运观众 ${randomId}~`;
    resultDiv.style.display = 'block';
});

// 获取规则容器和问号图标
const ruleContainer = document.getElementById('rule-container');
const infoIcon = document.querySelector('.info-icon');

// 切换规则显示
infoIcon.addEventListener('click', () => {
    if (ruleContainer.style.display === 'none' || ruleContainer.style.display === '') {
        updateRules();
        ruleContainer.style.display = 'block';
        ruleContainer.style.animation = 'slideIn 0.5s forwards';
    } else {
        ruleContainer.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => {
            ruleContainer.style.display = 'none';
        }, 500); // 延迟隐藏
    }
});

// 更新规则内容
function updateRules() {
    if (!document.getElementById('fair-mode').checked) {
        exemptedIdsContainer.innerHTML = "公平模式未启用，所有学号可被抽取~";
        return;
    }

    // 更新免抽学号列表
    const idsArray = Array.from(exemptedIds).sort((a, b) => a - b);
    exemptedIdsContainer.innerHTML = idsArray.length
        ? `免抽学号：${idsArray.map(id => `<span style="font-weight:bold; color:#e1be97;">${id}</span>`).join(', ')}`
        : '当前没有免抽学号,快去抽一次吧~';
}

// 自动保存免抽学号和设置到 localStorage
function saveState() {
    const settings = {
        exemptedIds: Array.from(exemptedIds),
        fairMode: document.getElementById('fair-mode').checked
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}

// 自动加载免抽学号和设置
function loadState() {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        const { exemptedIds: savedIds, fairMode } = JSON.parse(savedSettings);
        exemptedIds = new Set(savedIds); // 恢复免抽学号列表
        document.getElementById('fair-mode').checked = fairMode; // 恢复公平模式开关状态
        updateRules(); // 更新规则显示
    }
}

// 获取规则重置按钮
const resetRulesButton = document.getElementById('reset-rules-button');

// 为规则框的“重新来过”按钮绑定事件
resetRulesButton.addEventListener('click', () => {
    exemptedIds.clear(); // 清空免抽学号列表
    document.getElementById('fair-mode').checked = false; // 关闭公平模式
    updateRules(); // 更新规则显示
    saveState(); // 保存状态

    // 强制刷新规则框显示
    ruleContainer.style.display = 'none';
    setTimeout(() => {
        ruleContainer.style.display = 'block';
    }, 100);
    console.log("免抽学号和设置已重置！");
});

// 页面加载时自动加载状态
window.addEventListener('load', loadState);

// 保存学号范围
function saveNumberRange() {
    const start = parseInt(startInput.value) || '';
    const end = parseInt(endInput.value) || '';
    localStorage.setItem('numberRange', JSON.stringify({ start, end }));
}

// 加载学号范围
function loadNumberRange() {
    const savedRange = localStorage.getItem('numberRange');
    if (savedRange) {
        const { start, end } = JSON.parse(savedRange);
        if (start) startInput.value = start;
        if (end) endInput.value = end;
    }
}

// 输入框失去焦点时保存学号范围
startInput.addEventListener('blur', saveNumberRange);
endInput.addEventListener('blur', saveNumberRange);

// 页面加载时自动填充学号范围
window.addEventListener('load', () => {
    loadNumberRange();
    console.log('GitHub: https://github.com/fuqi0125/random-drawing, 感谢使用~');
});