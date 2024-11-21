// 错误提示容器
let errorDiv = null;

function createErrorDiv() {
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.classList.add('error');

        const errorText = document.createElement('p'); // 创建错误文字容器
        errorText.id = 'error-text';
        errorDiv.appendChild(errorText);

        // 添加 "重新来过" 按钮
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-error-button';
        resetButton.classList.add('reset-error-button');
        resetButton.textContent = '重新来过';
        errorDiv.appendChild(resetButton);

        // 挂载到容器
        document.querySelector('.container').appendChild(errorDiv);

        // 按钮功能
        resetButton.addEventListener('click', () => {
            exemptedIds.clear(); // 清空免抽学号列表
            errorDiv.style.display = 'none'; // 隐藏错误弹窗
        });
    }
    return errorDiv;
}

// 显示错误提示
function showError(message) {
    const errorDiv = createErrorDiv();
    const errorText = document.getElementById('error-text');
    errorText.textContent = message; // 更新错误文字
    errorDiv.style.display = 'block'; // 显示错误弹窗
}

// 隐藏错误提示
function hideError() {
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// 根据错误次数生成对应提示
function handleError(errorCount, start, end) {
    let message = "";
    if (errorCount === 1) {
        message = `对不起，你输的${start < 1 ? "开始" : "结束"}数字太${start < 1 || end < start ? "小" : "大"}啦～改一改呗`;
    } else if (errorCount === 2) {
        message = `额，还是不对：你输的${start < 1 ? "开始" : "结束"}数字太${start < 1 || end < start ? "小" : "大"}啦～再改一下`;
    } else if (errorCount === 3) {
        message = "我直接告诉你区间范围吧, 1~50 :)";
    } else {
        message = "你是故意找茬的是吗:(";
    }
    showError(message);
}