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
