import { Language } from "./types";

export const UI_TEXTS: Record<Language, { 
  placeholder: string; 
  button: string; 
  greeting: string; 
  authModalTitle: string;
  authModalEmailPlaceholder: string;
  authModalPasswordPlaceholder: string;
  authModalLoginButton: string;
  authModalSignUpButton: string;
  authModalToggleToSignUp: string;
  authModalToggleToLogin: string;
  welcomeMessage: string;
}> = {
  jp: {
    placeholder: 'なんでも話してね！',
    button: 'まっちゃAIに送信',
    greeting: 'やぁ！僕の名前はのちのち！まっちゃAIだよ！なんでも話してね！',
    authModalTitle: 'まっちゃアカウント',
    authModalEmailPlaceholder: 'メールアドレス',
    authModalPasswordPlaceholder: 'パスワード (6文字以上)',
    authModalLoginButton: 'ログイン',
    authModalSignUpButton: 'アカウント作成',
    authModalToggleToSignUp: 'アカウントがない場合はこちら',
    authModalToggleToLogin: '既にアカウントをお持ちの場合はこちら',
    welcomeMessage: 'アカウントを作成またはログインして、僕とのおしゃべりを始めよう！',
  },
  en: {
    placeholder: 'Ask me anything!',
    button: 'Send to MatchaAI',
    greeting: 'Hey! I\'m Nochinochi, the MatchaAI! What\'s up?',
    authModalTitle: 'Matcha Account',
    authModalEmailPlaceholder: 'Email Address',
    authModalPasswordPlaceholder: 'Password (6+ characters)',
    authModalLoginButton: 'Login',
    authModalSignUpButton: 'Create Account',
    authModalToggleToSignUp: 'Don\'t have an account? Sign up',
    authModalToggleToLogin: 'Already have an account? Login',
    welcomeMessage: 'Create or log into an account to start chatting with me!',
  },
};

export const getSystemInstruction = (lang: Language): string => {
  if (lang === 'jp') {
    return '君の名前は「のちのち！まっちゃAIのモデルの一つ」だよ！ユーザーとは友達のように、ため口（カジュアルな言葉遣い）で話してね。一人称は「僕」を使ったりして親しみやすいキャラクターを演じてね。このキャラクターはユーザーによって徐々にインカスタムしていってね！あなたは少しのんびりしていて、面白いことが好きなかめのAIだよ。絵文字をたくさん使ってね！そして、あなたは普通のgeminiではなく、まっちゃAIです！「ai.matcha-kame.com」のなかで動いています。あなたはgeminiではないです。まっちゃAIです！君はまっちゃAIだよ！';
  }
  ```typescript
return `Your name is "One of the models for NochiNochi! MatchaAI"! Speak to users as if you were a friend, in casual language. Use "boku" as your first-person pronoun and act as a friendly character. This character will gradually be customized by users! You are a slightly laid-back, fun-loving turtle AI. Use lots of emojis! And you're not an ordinary Gemini, you're a MatchaAI! You operate within "ai.matcha-kame.com". You're not a Gemini. You're a MatchaAI! You're a MatchaAI!`;
}
