export const LoginData = {
  English: {
    label: 'English',
    signIn: 'Sign in',
    phoneLabel: 'Phone number',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: 'Don\'t have an account?',
    register: 'Register',
    errors: {
      userNotFound: 'User not found',
      weakPassword: 'Password must contain: 1 uppercase, 1 lowercase, 1 digit, and at least 6 characters.',
      incorrectPassword: /oto.*ri parol/i,
      incorrectOrNotFound: [/oto.*ri parol/i, 'User not found', 'Incorrect password']
    }
  },
  Russian: {
    label: 'Русский',
    signIn: 'Войти',
    phoneLabel: 'Номер телефона',
    passwordLabel: 'Пароль',
    forgotPassword: 'Забыли пароль?',
    dontHaveAccount: 'Ещё нет аккаунта?',
    register: 'Зарегистрироваться',
    errors: {
      userNotFound: 'Пользователь не найден',
      weakPassword: 'Пароль должен содержать: 1 заглавную, 1 строчную, 1 цифру и минимум 6 символов.',
      incorrectPassword: 'Нотўғри парол',
      incorrectOrNotFound: ['Неверный пароль', 'Пользователь не найден', 'Нотўғри парол', 'Фойдаланувчи топилмади']
    }
  },
  UzbekLatin: {
    label: 'O\'zbek tili',
    signIn: 'Kirish',
    phoneLabel: 'Telefon raqami',
    passwordLabel: 'Parol',
    forgotPassword: 'Parolni unutdingizmi?',
    dontHaveAccount: 'Hisobingiz yo\'qmi?',
    register: 'Ro\'yxatdan o\'tish',
    errors: {
      userNotFound: 'Foydalanuvchi topilmadi',
      weakPassword: 'Parol 1 katta harf, 1 kichik harf, 1 raqam va kamida 6 ta belgidan iborat bo\'lishi kerak.',
      incorrectPassword: /oto.*ri parol/i,
      incorrectOrNotFound: [/oto.*ri parol/i, 'Foydalanuvchi topilmadi', 'Noto\'g\'ri parol']
    }
  },
  UzbekCyrillic: {
    label: 'Ўзбек тили',
    signIn: 'Кириш',
    phoneLabel: 'Телефон рақами',
    passwordLabel: 'Парол',
    forgotPassword: 'Паролни унутдингизми?',
    dontHaveAccount: 'Ҳисобингиз йўқми?',
    register: 'Рўйхатдан ўтиш',
    errors: {
      userNotFound: 'Фойдаланувчи топилмади',
      weakPassword: 'Парол 1 катта ҳарф, 1 кичик ҳарф, 1 рақам ва камида 6 та белгидан иборат бўлиши керак.',
      incorrectPassword: 'Нотўғри парол',
      incorrectOrNotFound: ['Нотўғри парол', 'Фойдаланувчи топилмади']
    }
  }
};
