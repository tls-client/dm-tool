let isCreatingGroups = false; // グループ作成中かどうかのフラグ
let isAddingUsers = false;   // ユーザー追加中かどうかのフラグ

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
  await new Promise((resolve) => setTimeout(resolve, 600000)); // 10分待機
  isCreatingGroups = false;
  createGroups(); // 再度グループ作成を実行
}

// ユーザーを追加する非同期関数
async function addUsers() {
  if (isAddingUsers) {
    document.getElementById("status").innerText = "ステータス: ユーザー追加処理が既に実行中です";
    return;
  }
  isAddingUsers = true;

  const token = document.getElementById("token").value;
  const groupId = document.getElementById("groupId").value.trim().split("\n")[0]; // 最初のグループIDを使用
  const userIds = document.getElementById("userIds").value.trim().split("\n");

  const headers = {
    "Authorization": token,
    "Content-Type": "application/json"
  };

  document.getElementById("status").innerText = "ステータス: ユーザー追加中...";

  for (const userId of userIds) {
    try {
      const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/recipients/${userId}`, {
        method: "PUT",
        headers: headers
      });

      if (response.ok) {
        document.getElementById("status").innerText = `ステータス: ユーザー ${userId} が追加されました`;
      } else {
        const errorData = await response.json();
        document.getElementById("status").innerText = `エラーが発生しました: ${errorData.message}`;
      }
    } catch (error) {
      document.getElementById("status").innerText = "ステータス: 通信エラーが発生しました";
    }
  }

  isAddingUsers = false;
}

// メッセージを送信する非同期関数
async function sendMessage() {
  const token = document.getElementById("token").value;
  const groupId = document.getElementById("groupId").value.trim().split("\n")[0]; // 最初のグループIDを使用
  const message = document.getElementById("message").value;
  const delay = parseFloat(document.getElementById("delay").value);

  const headers = {
    "Authorization": token,
    "Content-Type": "application/json"
  };

  document.getElementById("status").innerText = "ステータス: メッセージ送信中...";

  try {
    const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/messages`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ content: message })
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("status").innerText = `ステータス: メッセージ送信成功！ID: ${data.id}`;
    } else {
      const errorData = await response.json();
      document.getElementById("status").innerText = `エラーが発生しました: ${errorData.message}`;
    }
  } catch (error) {
    document.getElementById("status").innerText = "ステータス: 通信エラーが発生しました";
  }

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay)); // 遅延を適用
  }
}
