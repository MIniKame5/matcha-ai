// ==========================================================
// E. ファイル保存（暗号化）機能 - 修正版
// ==========================================================
function saveChatData() {
    const password = document.getElementById('save-password').value;
    if (!password) { alert('パスワードを入力してください！'); return; }
    
    document.getElementById('status-message').textContent = '保存処理中...';

    try {
        const dataToEncrypt = JSON.stringify(chatHistory);
        const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, password, { 
            keySize: 256 / 8, 
            salt: encryptionSalt 
        }).toString();

        const blob = new Blob([encrypted], { type: 'text/plain' });
        
        // ★★★ この部分を修正し、シンプルなダウンロードに切り替えます ★★★
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = requiredFileName; 
        
        // ユーザーのクリックイベントとして実行することで、ブロックされにくくする
        a.style.display = 'none'; // 画面には表示しない
        document.body.appendChild(a);
        a.click();
        
        // ダウンロード後のお掃除
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // ★★★ 修正終わり ★★★

        document.getElementById('status-message').textContent = '「' + requiredFileName + '」として保存されました！';
    } catch (e) {
        document.getElementById('status-message').textContent = '保存中にエラーが発生しました。（暗号化エラーかも）';
        console.error("保存エラー:", e); // F12キーで開発者ツールを開いて、エラーの詳細を見てみましょう
    }
}
