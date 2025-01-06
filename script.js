let isCreatingGroups = false; // グループ作成中かどうかのフラグ
let isAddingUsers = false;   // ユーザー追加中かどうかのフラグ

// フォームバリデーション関数
function validateForm() {
    const token = document.getElementById("token").value.trim();
    const groupId = document.getElementById("groupId").value.trim();
    const userIds = document.getElementById("userIds").value.trim();

    if (!token) {
        logMessage("エラー: トークンを入力してください");
        return false;
    }

    if (!groupId && !userIds) {
        logMessage("エラー: グループIDまたはユーザーIDを入力してください");
        return false;
    }

    logMessage("ステータス: 入力検証成功");
    return true;
}

// ステータスメッセージをログに表示する
function logMessage(message) {
    document.getElementById("status").innerText = `ステータス: ${message}`;
}

// ボタンの有効/無効を切り替える
function toggleButtons(disable) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = disable;
        button.style.backgroundColor = disable ? "gray" : "#3498db";
    });
}

// グループ作成関数
async function createGroups() {
    if (isCreatingGroups) {
        logMessage("グループ作成処理が既に実行中です");
        return;
    }
    isCreatingGroups = true;
    toggleButtons(true);

    const token = document.getElementById("token").value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    logMessage("グループ作成中...");

    try {
        for (let i = 0; i < 10; i++) {
            const response = await fetch("https://discord.com/api/v9/users/@me/channels", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ recipients: [] })
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById("groupId").value += data.id + "\n";
                logMessage(`グループ作成完了: ID ${data.id}`);
            } else {
                const errorData = await response.json();
                logMessage(`エラー: ${errorData.message}`);
            }

            await delay(600000); // レート制限に対応 (10分)
        }
    } catch (error) {
        logMessage("通信エラーが発生しました");
    }

    isCreatingGroups = false;
    toggleButtons(false);
}

// ユーザー追加関数
async function addUsers() {
    if (isAddingUsers) {
        logMessage("ユーザー追加処理が既に実行中です");
        return;
    }
    isAddingUsers = true;
    toggleButtons(true);

    const token = document.getElementById("token").value;
    const groupId = document.getElementById("groupId").value.trim().split("\n")[0]; // 最初のグループID
    const userIds = document.getElementById("userIds").value.trim().split("\n");

    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    logMessage("ユーザー追加中...");

    try {
        for (const userId of userIds) {
            const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/recipients/${userId}`, {
                method: "PUT",
                headers: headers
            });

            if (response.ok) {
                logMessage(`ユーザー追加成功: ID ${userId}`);
            } else {
                const errorData = await response.json();
                logMessage(`エラー: ${errorData.message}`);
            }

            await delay(120000); // レート制限に対応 (120秒)
        }
    } catch (error) {
        logMessage("通信エラーが発生しました");
    }

    isAddingUsers = false;
    toggleButtons(false);
}

// メッセージ送信関数
async function sendMessage() {
    const token = document.getElementById("token").value;
    const groupId = document.getElementById("groupId").value.trim().split("\n")[0]; // 最初のグループID
    const message = document.getElementById("message").value;
    const delayTime = parseFloat(document.getElementById("delay").value);

    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    logMessage("メッセージ送信中...");

    try {
        const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/messages`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ content: message })
        });

        if (response.ok) {
            const data = await response.json();
            logMessage(`メッセージ送信成功: ID ${data.id}`);
        } else {
            const errorData = await response.json();
            logMessage(`エラー: ${errorData.message}`);
        }

        if (delayTime > 0) {
            await delay(delayTime * 1000); // 遅延時間適用
        }
    } catch (error) {
        logMessage("通信エラーが発生しました");
    }
}

// 遅延用のユーティリティ関数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
