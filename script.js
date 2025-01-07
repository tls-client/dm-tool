// ステータス更新用関数
function updateStatus(message) {
    const statusElement = document.getElementById("status");
    statusElement.textContent = `ステータス: ${message}`;
}

// トークン取得
function getToken() {
    const token = document.getElementById("token").value.trim();
    if (!token) {
        updateStatus("トークンが入力されていません");
        throw new Error("トークンが必要です");
    }
    return token;
}

// グループ作成
async function createGroups() {
    const token = getToken();
    updateStatus("グループを作成しています...");

    try {
        for (let i = 0; i < 10; i++) { // 10個のグループを作成
            const response = await fetch("https://discord.com/api/v9/users/@me/channels", {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type: 3 }) // グループ作成
            });

            if (!response.ok) {
                throw new Error(`グループ作成エラー: ${response.statusText}`);
            }

            const groupData = await response.json();
            console.log(`グループ作成成功: ID=${groupData.id}`);
        }
        updateStatus("グループ作成が完了しました");
    } catch (error) {
        console.error(error);
        updateStatus("グループ作成中にエラーが発生しました");
    }
}

// ユーザー追加
async function addUsers() {
    const token = getToken();
    const userIds = document.getElementById("userIds").value.trim().split("\n");
    const groupId = document.getElementById("groupId").value.trim();

    if (!groupId || userIds.length === 0) {
        updateStatus("グループIDまたはユーザーIDが入力されていません");
        return;
    }

    updateStatus("ユーザーを追加しています...");

    try {
        for (const userId of userIds) {
            const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/recipients/${userId}`, {
                method: "PUT",
                headers: { Authorization: token }
            });

            if (!response.ok) {
                console.warn(`ユーザー追加エラー: ${response.statusText}`);
                continue;
            }
            console.log(`ユーザー追加成功: ID=${userId}`);
        }
        updateStatus("ユーザー追加が完了しました");
    } catch (error) {
        console.error(error);
        updateStatus("ユーザー追加中にエラーが発生しました");
    }
}

// メッセージ送信
async function sendMessage() {
    const token = getToken();
    const message = document.getElementById("message").value.trim();
    const groupId = document.getElementById("groupId").value.trim();
    const delay = parseFloat(document.getElementById("delay").value) * 1000;

    if (!groupId || !message) {
        updateStatus("グループIDまたはメッセージが入力されていません");
        return;
    }

    updateStatus("メッセージを送信しています...");

    try {
        await fetch(`https://discord.com/api/v9/channels/${groupId}/messages`, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: message })
        });
        updateStatus("メッセージ送信が完了しました");
        console.log(`メッセージ送信: ${message}`);
    } catch (error) {
        console.error(error);
        updateStatus("メッセージ送信中にエラーが発生しました");
    }

    // 遅延
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// グループ名変更
async function changeGroupNames() {
    const token = getToken();
    const groupId = document.getElementById("groupId").value.trim();
    const newName = document.getElementById("newName").value.trim();

    if (!groupId || !newName) {
        updateStatus("グループIDまたは新しいグループ名が入力されていません");
        return;
    }

    updateStatus("グループ名を変更しています...");

    try {
        await fetch(`https://discord.com/api/v9/channels/${groupId}`, {
            method: "PATCH",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName })
        });
        updateStatus("グループ名の変更が完了しました");
        console.log(`グループ名変更成功: ${newName}`);
    } catch (error) {
        console.error(error);
        updateStatus("グループ名変更中にエラーが発生しました");
    }
}

// グループアイコン変更
async function changeGroupIcons() {
    const token = getToken();
    const groupId = document.getElementById("groupId").value.trim();
    const newIconUrl = document.getElementById("newIconUrl").value.trim();

    if (!groupId || !newIconUrl) {
        updateStatus("グループIDまたは新しいアイコンURLが入力されていません");
        return;
    }

    updateStatus("グループアイコンを変更しています...");

    try {
        const response = await fetch(newIconUrl);
        const blob = await response.blob();
        const base64Icon = await blobToBase64(blob);

        await fetch(`https://discord.com/api/v9/channels/${groupId}`, {
            method: "PATCH",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ icon: base64Icon })
        });
        updateStatus("グループアイコンの変更が完了しました");
        console.log(`グループアイコン変更成功: ${newIconUrl}`);
    } catch (error) {
        console.error(error);
        updateStatus("グループアイコン変更中にエラーが発生しました");
    }
}

// BlobをBase64に変換
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
