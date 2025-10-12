// ==========================================================
// A. 状態と設定
// ==========================================================
let chatHistory = [{ role: 'ai', text: 'AIモデルをロード中です。しばらくお待ちください。' }]; 
const requiredFileName = 'AI_data.matcha'; 
const encryptionSalt = 'matcha-kame-salt'; // 暗号化のソルト（秘密鍵の一部）
let generator = null; 
// ★★★ 最終モデル決定！v2ライブラリで最も安定して動いていたPhi-3モデルに戻す！ ★★★
const modelName = 'Xenova/phi-3-mini-4k-instruct'; 
// ★★★ 修正終わり ★★★
// ==========================================================
// B. DOM操作とメッセージ表示
// ==========================================================
function displayMessage(role, text) {
    const chatWindow = document.getElementById('chat-window');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', role);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    // 改行を反映させるために pre タグを使う
    const pre = document.createElement('pre');
    pre.textContent = text;
    messageContent.appendChild(pre);
    
    messageContainer.appendChild(messageContent);
    chatWindow.appendChild(messageContainer);
    
    // スクロールを一番下へ
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function clearChatWindow() {
    document.getElementById('chat-window').innerHTML = '';
}

// ==========================================================
// C. AI モデルのロード
// ==========================================================
async function loadAI() {
    document.getElementById('status-message').textContent = 'AIモデルをロード中...（初回は数分かかる場合があります）';
    try {
        // ★★★ 修正箇所2: v3のimport URLに変更！(index.htmlと揃える) ★★★
        const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0');
        
        // パイプラインを初期化してモデルをロード
        // ★★★ 修正箇所3: revisionオプションを削除して、v3のデフォルト設定でアクセス！ ★★★
        generator = await pipeline('text-generation', modelName, {
            localModel: false, // Hugging Faceからダウンロードさせる
            // revision: 'quantized' などのオプションはv3で不要になった可能性があるので削除
        });
        // ★★★ 修正終わり ★★★
        
        document.getElementById('status-message').textContent = 'AIモデルのロードが完了しました！質問できます。';
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-button').disabled = false;
        
        // ロード完了後に最初のAIメッセージを更新
        chatHistory[0].text = 'AIモデルのロードが完了しました！さあ、私に何を聞く？';
        clearChatWindow();
        displayMessage('ai', chatHistory[0].text);

    } catch (e) {
        document.getElementById('status-message').textContent = 'AIロードエラー: モデルの読み込みに失敗しました。';
        console.error("AIロードエラー:", e);
    }
}

// ==========================================================
// D. メッセージ送信と応答生成
// ==========================================================
async function sendMessage() {
    const input = document.getElementById('user-input');
    const userText = input.value.trim();
    if (!userText || !generator) return;

    // ユーザーメッセージを追加
    chatHistory.push({ role: 'user', text: userText });
    displayMessage('user', userText);
    input.value = '';
    
    // AI応答の準備
    let aiTextPlaceholder = 'AIが考えています...';
    displayMessage('ai', aiTextPlaceholder);

    try {
        // 過去の会話をモデルの入力形式に整形 (Phi-3のフォーマットは複雑なため、一旦シンプルな形式を使用)
        const formattedChat = chatHistory.map(msg => `${msg.role === 'user' ? 'ユーザー' : 'AI'}: ${msg.text}`).join('\n') + '\nAI:';
        
        // AI応答を生成
        const output = await generator(formattedChat, {
            max_new_tokens: 150,
            do_sample: true,
            temperature: 0.7,
            repetition_penalty: 1.2
        });
        
        let aiText = output[0].generated_text.trim();
        
        // 不要な繰り返し（"AI:"など）を削除
        const cleanAiText = aiText.substring(aiText.lastIndexOf('AI:') + 3).trim();
        
        // 最後のAIメッセージを更新
        const lastAiMessage = document.querySelector('#chat-window > .ai:last-child > .message-content > pre');
        if (lastAiMessage) {
            lastAiMessage.textContent = cleanAiText;
        }

        // 履歴も更新
        chatHistory.push({ role: 'ai', text: cleanAiText });

    } catch (e) {
        const lastAiMessage = document.querySelector('#chat-window > .ai:last-child > .message-content > pre');
        if (lastAiMessage) {
            lastAiMessage.textContent = 'エラーが発生しました。もう一度試してください。';
        }
        console.error("AI応答エラー:", e);
    }
}

// ==========================================================
// E. ファイル保存（暗号化）機能 - 安定版
// ==========================================================
function saveChatData() {
    const password = document.getElementById('save-password').value;
    if (!password) { alert('パスワードを入力してください！'); return; }
    
    document.getElementById('status-message').textContent = '保存処理中...';

    try {
        const dataToEncrypt = JSON.stringify(chatHistory);
        // 暗号化を安定させる
        const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, password).toString();

        const blob = new Blob([encrypted], { type: 'text/plain' });
        
        // ファイルのダウンロード処理
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = requiredFileName; 
        
        a.style.display = 'none'; 
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        document.getElementById('status-message').textContent = '「' + requiredFileName + '」として保存されました！';
    } catch (e) {
        document.getElementById('status-message').textContent = '保存中にエラーが発生しました。（パスワードやファイル名を確認してね）';
        console.error("保存エラー:", e);
    }
}

// ==========================================================
// F. ファイル読み込み（復号化）機能
// ==========================================================
function loadChatData() {
    const password = document.getElementById('save-password').value;
    if (!password) { 
        alert('パスワードを入力してください！'); 
        return; 
    }

    const fileInput = document.getElementById('load-file-input');
    if (fileInput.files.length === 0) {
        alert('ファイルを一つ選択してください。');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        document.getElementById('status-message').textContent = '読み込み処理中...';
        try {
            const encryptedText = event.target.result;
            
            // 復号化を試みる
            const bytes = CryptoJS.AES.decrypt(encryptedText, password); 
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            
            // ★★★ ここが重要！復号に失敗すると、decryptedTextは空か、無効なJSONになる！ ★★★
            if (!decryptedText || decryptedText.length === 0) {
                // パスワードが間違っている、またはデータが壊れている
                document.getElementById('status-message').textContent = 'エラー: パスワードが違うか、ファイルが壊れています。';
                // 処理をここで停止
                return; 
            }

            const loadedHistory = JSON.parse(decryptedText);
            
            // さらに厳しくチェック：配列であること、中身があることを確認
            if (!Array.isArray(loadedHistory) || loadedHistory.length === 0) {
                document.getElementById('status-message').textContent = 'エラー: ファイルの内容が不正です。（履歴データ形式ではありません）';
                return; 
            }
            
            // 履歴を入れ替えて表示を更新
            chatHistory = loadedHistory;
            clearChatWindow();
            chatHistory.forEach(msg => displayMessage(msg.role, msg.text));
            
            document.getElementById('status-message').textContent = 'データを読み込みました！会話を再開できます。';
        } catch (e) {
            // JSON.parse() やその他の予期せぬエラーをキャッチ
            document.getElementById('status-message').textContent = 'エラー: ファイルの内容を処理できませんでした。（データ形式が間違っている可能性があります）';
            console.error("読み込みエラー:", e);
        }
    };

    reader.onerror = function() {
        document.getElementById('status-message').textContent = 'エラー: ファイルの読み取り中に問題が発生しました。';
    };

    reader.readAsText(file);
}
// ==========================================================
// G. 初期化とイベントリスナー
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 最初にAIモデルをロード
    loadAI(); 

    // メッセージ送信ボタン
    document.getElementById('send-button').addEventListener('click', sendMessage);

    // Enterキーでも送信できるようにする
    document.getElementById('user-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Enterキーのデフォルト動作（改行など）を防ぐ
            sendMessage();
        }
    });

    // データ保存ボタン
    document.getElementById('save-button').addEventListener('click', saveChatData);

    // データ読み込みボタン（ファイル選択を促す）
    document.getElementById('load-button').addEventListener('click', () => {
        document.getElementById('load-file-input').click();
    });

    // ファイル選択後に実際に読み込み処理を実行
    document.getElementById('load-file-input').addEventListener('change', loadChatData);
});







