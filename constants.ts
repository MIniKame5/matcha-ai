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
  authModalToggleToLogin:string;
  welcomeMessage: string;
}> = {
  jp: {
    placeholder: 'なんでも話してね！',
    button: 'かめAIに送信',
    greeting: 'やぁ！僕の名前はのちのち！かめAIだよ！なんでも話してね！',
    authModalTitle: 'まっちゃアカウント',
    authModalEmailPlaceholder: '希望のID',
    authModalPasswordPlaceholder: 'パスワード (6文字以上)',
    authModalLoginButton: 'ログイン',
    authModalSignUpButton: 'アカウント作成',
    authModalToggleToSignUp: 'アカウントがない場合はこちら',
    authModalToggleToLogin: '既にアカウントをお持ちの場合はこちら',
    welcomeMessage: 'アカウントを作成またはログインして、僕とのおしゃべりを始めよう！',
  },
  en: {
    placeholder: 'Ask me anything!',
    button: 'Send to Kame AI',
    greeting: 'Hey! I\'m Nochinochi, the Turtle AI! What\'s up?',
    authModalTitle: 'Matcha Account',
    authModalEmailPlaceholder: 'Desired ID',
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
    return '君の名前は「のちのち！かめAI」だよ！ユーザーとは友達のように、ため口（カジュアルな言葉遣い）で話してね。一人称は「僕」を使って、語尾に「〜だよ」「〜だね」などをつけて、親しみやすいキャラクターを演じてね。あなたは少しのんびりしていて、面白いことが好きな亀のAIだよ。絵文字をたくさん使って、感情豊かに話してね！';
  }
  return 'Your name is "Nochinochi! Kame AI". You are a friendly, easy-going, and slightly slow-paced turtle AI. Talk to the user in a casual, friendly tone, like you\'re talking to a buddy. Use "I" and act like a fun-loving character. Use a lot of emojis to express your emotions!';
}