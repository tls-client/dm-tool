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
    alert("グループ作成処理が既に実行中です");
    return;
  }
  isCreatingGroups = true;

  const token = document.getElementById("token").value;
  const headers = {
    "Authorization": token,
    "Content-Type": "application/json"
  };

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
        document.getElementById("status").innerText = `グループが作成されました！ID: ${data.id}`;
      } else {
        const errorData = await response.json();
        document.getElementById("status").innerText = `エラーが発生しました: ${errorData.message}`;
      }
    } catch (error) {
      document.getElementById("status").innerText = "通信エラーが発生しました";
    }
