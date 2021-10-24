module AuthHelper
  CurrentAndRegistration = {
    action: 'message',
    title: 'Вы уже зарегистрированы',
    h1: 'Вы уже вошли',
    text: 'Вы уже зарегистрированы и аутентифицированы в системе'
  }.freeze

  CurrentAndLogin = {
    action: 'message',
    title: 'Вы уже вошли в систему',
    h1: 'Вы уже вошли',
    text: 'Вы уже аутентифицированы в системе'
  }.freeze

  CurrentAndRecovery = {
    action: 'message',
    title: 'Вы уже вошли в систему',
    h1: 'Вы уже вошли',
    text: 'Вы уже аутентифицированы в системе'
  }.freeze

  RecoveryInstr = {
    action: 'message',
    title: 'Инструкция по восстановлению пароля отправлена',
    h1: 'Инструкция отправлена',
    text: 'Инструкция по восстановлению пароля отправлена Вам на почту.'
  }.freeze

  ResetPasswordError = {
    action: 'message',
    title: 'Восстановление пароля по данному токену невозможно.',
    h1: 'Токен устарел',
    text: 'Восстановление пароля по данному токену невозможно.'
  }.freeze
end
