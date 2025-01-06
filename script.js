let isCreatingGroups = false; // グループ作成中かどうかのフラグ
let isAddingUsers = false;    // ユーザー追加中かどうかのフラグ
let groupsCreated = false;    // グループ作成が完了したかどうかのフラグ

// ボタンの状態を切り替える関数
function toggleButtons(disable) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.disabled = disable;
        button.style.backgroundColor = disable ? "gray" : "white";
    });
}

// クリップボードにコピーする関数
function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).value;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("クリップボードにコピーしました");
        })
        .catch((error) => {
            console.error("コピーに失敗しました: ", error);
        });
}

// グループを作成する非同期関数
async function createGroups() {
    if (isCreatingGroups) {
        document.getElementById("status").innerText = "ステータス: グループ作成処理が既に実行中です";
        return;
    }
    isCreatingGroups = true;

    const token = document.getElementById("token").value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    document.getElementById("status").innerText = "ステータス: グループ作成中...";

    for (let i = 0; i < 10; i++) {
        try {
            const response = await fetch("https://discord.com/api/v9/users/@me/channels", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ recipients: [] })
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById("groupId").value += data.id + "\n";
                document.getElementById("status").innerText = `ステータス: グループ作成完了！ID: ${data.id}`;
            } else {
                const errorData = await response.json();
                document.getElementById("status").innerText = `エラーが発生しました: ${errorData.message}`;
            }
        } catch (error) {
            document.getElementById("status").innerText = "ステータス: 通信エラーが発生しました";
        }
    }

    document.getElementById("status").innerText += " 10個のグループが作成されました。";
    groupsCreated = true;  // グループ作成が完了したことを示すフラグを立てる
    isCreatingGroups = false;
}

// ユーザーをグループに追加する非同期関数
async function addUsers() {
    if (!groupsCreated) {
        document.getElementById("status").innerText = "先にグループ作成してください";
        return;
    }

    if (isAddingUsers) {
        document.getElementById("status").innerText = "ステータス: ユーザー追加処理が既に実行中です";
        return;
    }
    isAddingUsers = true;

    const token = document.getElementById("token").value;
    const groupIds = document.getElementById("groupId").value.split("\n");
    const userIds = document.getElementById("userIds").value.split("\n");
    const delay = parseFloat(document.getElementById("delay").value);  // ユーザー追加の遅延時間
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    document.getElementById("status").innerText = "ステータス: ユーザー追加中...";

    for (const groupId of groupIds) {
        for (const userId of userIds) {
            try {
                // ユーザーを追加するリクエスト
                const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/recipients/${userId}`, {
                    method: "PUT",
                    headers: headers
                });

                if (response.ok) {
                    document.getElementById("status").innerText = `ユーザー ${userId} がグループ ${groupId} に追加されました`;
                } else {
                    const errorData = await response.json();
                    document.getElementById("status").innerText = `エラーが発生しました: ${errorData.message}`;
                }

                // 遅延を設定 (次のリクエスト前に待機)
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                document.getElementById("status").innerText = "ステータス: 通信エラーが発生しました";
            }
        }
    }

    document.getElementById("status").innerText = "ユーザー追加が完了しました。";
    isAddingUsers = false;
}

// メッセージ送信の処理
async function sendMessage() {
    if (!groupsCreated) {
        document.getElementById("status").innerText = "先にグループ作成してください";
        return;
    }

    // メッセージ送信処理のコードをここに追加
    document.getElementById("status").innerText = "メッセージ送信中...";
    // ここで実際のメッセージ送信のAPIを呼び出すコードを追加
}
</script>
