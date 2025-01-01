let isCreatingGroups = false;
let isAddingUsers = false;

// ボタンの有効/無効を切り替える
function toggleButtons(enabled) {
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = !enabled;
    button.style.backgroundColor = enabled ? "gray" : "white";
  });
}

// クリップボードにコピー
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).value.trim();
  navigator.clipboard.writeText(text)
    .then(() => alert("クリップボードにコピーしました"))
    .catch((error) => console.error("コピーに失敗しました: ", error));
}

// グループを作成
async function createGroups() {
  if (isCreatingGroups) {
    alert("グループ作成処理が既に実行中です");
    return;
  }
  isCreatingGroups = true;

  const token = document.getElementById("token").value.trim();
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch("https://discord.com/api/v9/users/@me/channels", {
        method: "POST",
        headers,
        body: JSON.stringify({ recipients: [] }),
      });

      if (response.ok) {
        const data = await response.json();
        const groupId = data.id;
        console.log(`グループが作成されました！ID: ${groupId}`);
      } else {
        const errorData = await response.json();
        console.error(`エラーが発生しました: ${errorData.message}`);
      }
    } catch (error) {
      console.error("通信エラーが発生しました", error);
    }
  }

  isCreatingGroups = false;
}

// メッセージを送信
async function sendMessage() {
  const token = document.getElementById("token").value.trim();
  const groupIds = document.getElementById("groupIds").value.split("\n").filter(Boolean);
  const message = document.getElementById("message").value.trim();
  const delay = parseFloat(document.getElementById("delay").value) * 1000;

  if (groupIds.length === 0) {
    alert("先にグループを作成してください");
    return;
  }

  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  for (const groupId of groupIds) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: message }),
      });

      if (response.ok) {
        console.log(`メッセージが送信されました！グループID: ${groupId}`);
      } else {
        const errorData = await response.json();
        console.error(`送信エラー: ${errorData.message} (グループID: ${groupId})`);
      }
    } catch (error) {
      console.error(`通信エラーが発生しました (グループID: ${groupId})`, error);
    }
  }
}
