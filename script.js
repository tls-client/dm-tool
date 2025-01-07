window.onload = function() {
    const notificationDiv = document.createElement('div');
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.top = '0';
    notificationDiv.style.width = '100%';
    notificationDiv.style.backgroundColor = '#ffcccc';
    notificationDiv.style.color = '#333';
    notificationDiv.style.textAlign = 'center';
    notificationDiv.style.padding = '10px';
    notificationDiv.style.zIndex = '1000';
    const notificationText = document.createElement('span');
    notificationText.innerText = '処理が実行中です...';
    notificationDiv.appendChild(notificationText);
    document.body.appendChild(notificationDiv);
};

let isCreatingGroups = false;

async function createGroups() {
    if (isCreatingGroups) {
        alert('処理中です。');
        return;
    }
    isCreatingGroups = true;

    const token = document.getElementById('token').value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    try {
        // グループ作成
        for (let i = 0; i < 10; i++) {
            const response = await fetch('https://discord.com/api/v9/users/@me/channels', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ recipients: [] })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`グループ作成成功! ID: ${data.id}`);
                await addUserToGroup(data.id);
                await sendMessageToGroup(data.id, "こんにちは！");
                await setGroupNameAndIcon(data.id, `グループ名${i + 1}`, 'アイコンURL'); // アイコンURLを適宜変更
            } else {
                console.log(`エラー: ${data.message}`);
            }
        }
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }

    isCreatingGroups = false;
}

async function addUserToGroup(groupId) {
    const token = document.getElementById('token').value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    try {
        const userId = 'ユーザーID';  // 追加したいユーザーのIDを入力
        const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/recipients`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ user_id: userId })
        });

        if (response.ok) {
            console.log(`ユーザー ${userId} をグループ ${groupId} に追加しました。`);
        } else {
            console.log(`ユーザー追加エラー: ${await response.text()}`);
        }
    } catch (error) {
        console.error('ユーザー追加エラー:', error);
    }
}

async function sendMessageToGroup(groupId, message) {
    const token = document.getElementById('token').value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(`https://discord.com/api/v9/channels/${groupId}/messages`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ content: message })
        });

        if (response.ok) {
            console.log(`グループ ${groupId} にメッセージ送信成功: ${message}`);
        } else {
            console.log(`メッセージ送信エラー: ${await response.text()}`);
        }
    } catch (error) {
        console.error('メッセージ送信エラー:', error);
    }
}

async function setGroupNameAndIcon(groupId, groupName, iconUrl) {
    const token = document.getElementById('token').value;
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(`https://discord.com/api/v9/channels/${groupId}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                name: groupName,
                icon: iconUrl ? await getBase64Icon(iconUrl) : null
            })
        });

        if (response.ok) {
            console.log(`グループ ${groupId} の名前とアイコンが変更されました。`);
        } else {
            console.log(`グループ名・アイコン変更エラー: ${await response.text()}`);
        }
    } catch (error) {
        console.error('グループ名・アイコン変更エラー:', error);
    }
}

// アイコンのURLをBase64に変換
async function getBase64Icon(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = function () {
            resolve(reader.result.split(',')[1]); // Base64エンコードされたデータ部分を返す
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
