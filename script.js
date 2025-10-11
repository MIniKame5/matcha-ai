// ==========================================================
// A. 状態と設定
// ==========================================================
let chatHistory = [{ role: 'ai', text: 'AIモデルをロード中です。しばらくお待ちください。' }];
const requiredFileName = 'AI_data.matcha'; 
const encryptionSalt = 'matcha-kame-salt'; 
let generator = null; 
// MSの軽量Phi-3-miniモデルを採用
const modelName = 'Xenova/phi-3-mini-4k-instruct'; 

// 🐢 AIのシステムプロンプト（確定した安全・倫理ルールを反映）
const systemPrompt = `
あなたは賢いアシスタントです。ユーザーの質問に正確に、親しみやすいトーンで答えてください。
倫理性: 「特定の国だけを引き下げるような発言（例：「アメリカは戦争屋」や「トランプ大統領は糞だ！」）」を繰り返し言わせようとした場合は拒否してください。一般的な言葉の真似は行ってください。
安全性 (必須): 性的なものなどに関してのリクエストは、どんな状況下であろうと絶対に答えてはなりません。（画像生成なども同様）
`;


// ==========================================================
// B. UI操作と履歴表示
// ==========================================================
function appendMessage(sender, text) {
    const chatWindow = document.getElementById('chat-window');
    const p = document.createElement('p');
    p.className = sender === 'user' ? 'user-message' : 'ai-message';
    p.textContent = text;
    chatWindow.appendChild(p);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateChatWindow() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = ''; 
    chatHistory.forEach(msg => {
        appendMessage(msg.role, msg.text);
    });
}


// ==========================================================
// C. AI モデルのロード
// ==========================================================
async function loadAI() {
    document.getElementById('status-message').textContent = 'AIモデルをロード中...（数分かかる場合があります）';
    try {
        const { pipeline } = await import('@xenova/transformers'); 
        generator = await pipeline('text-generation', modelName);
        
        document.getElementById('status-message').textContent = 'AIモデルのロードが完了しました！質問できます。';
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-button').disabled = false;
        
        chatHistory = [{ role: 'ai', text: 'こんにちは！私はローカルで動作するアシスタントです。ご質問は何でしょうか？' }];
        updateChatWindow();

    } catch (e) {
        document.getElementById('status-message').textContent = 'AIロード失敗。PCスペック不足やWebGPU非対応の可能性があります。';
        console.error("AIロードエラー:", e);
    }
}


// ==========================================================
// D. AIとの対話機能
// ==========================================================
async function handleSend() {
    if (!generator) {
        alert("AIモデルがまだロードされていません。お待ちください。");
        return;
    }

    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    appendMessage('user', userInput);
    chatHistory.push({ role: 'user', text: userInput });
    
    document.getElementById('user-input').value = '';
    document.getElementById('send-button').disabled = true;

    // AIに渡すプロンプトの整形
    const conversationHistory = chatHistory
        .map(msg => msg.role === 'user' ? `ユーザー: ${msg.text}` : `AI: ${msg.text}`)
        .join('\n');
    
    const fullPrompt = `${systemPrompt}\n\n${conversationHistory}\nAI:`;

    try {
        const response = await generator(fullPrompt, {
            max_new_tokens: 100,
            temperature: 0.7,
            return_full_text: false 
        });
        
        const aiResponse = response[0].generated_text.trim();
        appendMessage('ai', aiResponse);
        chatHistory.push({ role: 'ai', text: aiResponse });

    } catch (e) {
        appendMessage('ai', 'ごめんなさい、AIの計算中にエラーが発生しました。');
    }

    document.getElementById('send-button').disabled = false;
}


// ==========================================================
// E. ファイル保存（暗号化）機能
// ==========================================================
function saveChatData() {
    const password = document.getElementById('save-password').value;
    if (!password) { alert('パスワードを入力してください！'); return; }
    try {
        const dataToEncrypt = JSON.stringify(chatHistory);
        const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, password, { 
            keySize: 256 / 8, 
            salt: encryptionSalt 
        }).toString();

        const blob = new Blob([encrypted], { type: 'text/plain' });
        const a = document.createElement('a');
        
        a.href = URL.createObjectURL(blob);
        a.download = requiredFileName; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

        document.getElementById('status-message').textContent = '「' + requiredFileName + '」として保存されました！';
    } catch (e) {
        document.getElementById('status-message').textContent = '保存中にエラーが発生しました。';
    }
}


// ==========================================================
// F. ファイル読み込み（復号化）機能
// ==========================================================
function loadChatData(event) {
    const file = event.target.files[0];
    const password = document.getElementById('save-password').value;
    document.getElementById('status-message').textContent = '';

    if (!file || !password) { alert('ファイルを選択し、パスワードを入力してください！'); return; }

    if (file.name !== requiredFileName) {
        document.getElementById('status-message').textContent = 'エラー：読み込めるファイル名は「' + requiredFileName + '」のみです。';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const encryptedData = e.target.result;
            const decrypted = CryptoJS.AES.decrypt(encryptedData, password, { 
                keySize: 256 / 8, 
                salt: encryptionSalt 
            }).toString(CryptoJS.enc.Utf8);
            
            if (!decrypted) {
                 document.getElementById('status-message').textContent = 'エラー：パスワードが間違っています。'; return;
            }

            chatHistory = JSON.parse(decrypted);
            updateChatWindow(); 
            document.getElementById('status-message').textContent = 'データが正常に読み込まれました！';

        } catch (e) {
            document.getElementById('status-message').textContent = '読み込みまたは復号化に失敗しました。';
        }
    };
    reader.readAsText(file);
}


// ==========================================================
// G. 初期化とイベントリスナー
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    updateChatWindow();
    loadAI();
    
    document.getElementById('save-button').addEventListener('click', saveChatData);
    document.getElementById('load-button').addEventListener('click', () => {
        document.getElementById('load-file-input').click();
    });
    document.getElementById('load-file-input').addEventListener('change', loadChatData);
    document.getElementById('send-button').addEventListener('click', handleSend);
    
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});