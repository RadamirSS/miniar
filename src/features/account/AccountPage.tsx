import { useState } from 'react'
import { useAppStore } from '@/state/useAppStore'

type FormState = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const initialErrors: Record<keyof FormState, string> = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export function AccountPage() {
  const userName = useAppStore((s) => s.userName)
  const userEmail = useAppStore((s) => s.userEmail)
  const userRegistered = useAppStore((s) => s.userRegistered)
  const setUserProfile = useAppStore((s) => s.setUserProfile)

  const [form, setForm] = useState<FormState>({
    name: userName || '',
    email: userEmail || '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState(initialErrors)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const nextErrors = { ...initialErrors }
    let isValid = true
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()

    if (!trimmedName) {
      nextErrors.name = 'Введите ваше имя'
      isValid = false
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Введите e-mail'
      isValid = false
    } else if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Введите корректный e-mail'
      isValid = false
    }

    if (!form.password) {
      nextErrors.password = 'Введите пароль'
      isValid = false
    } else if (form.password.length < 6) {
      nextErrors.password = 'Минимум 6 символов'
      isValid = false
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Подтвердите пароль'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Пароли не совпадают'
      isValid = false
    }

    setErrors(nextErrors)
    return isValid
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      return
    }
    setUserProfile({
      name: form.name.trim(),
      email: form.email.trim()
    })
    setSubmitted(true)
    setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }))
  }

  return (
    <section style={{ display: 'grid', gap: 16, marginTop: 8 }}>
      <div className="card" style={{ padding: 18, display: 'grid', gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>Личный кабинет</h2>
          <p className="note" style={{ marginTop: 4 }}>
            Зарегистрируйтесь, чтобы сохранять результаты и настраивать тарифный план.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <Field
            label="Имя"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
          <Field
            label="E-mail"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="example@mail.com"
            autoComplete="email"
          />
          <Field
            label="Пароль"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            placeholder="••••••"
            autoComplete="new-password"
          />
          <Field
            label="Подтверждение пароля"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="Повторите пароль"
            autoComplete="new-password"
          />

          <button type="submit" className="btn" style={{ marginTop: 4, maxWidth: 240 }}>
            Зарегистрироваться
          </button>

          {submitted && (
            <div
              className="note"
              style={{
                padding: 12,
                borderRadius: 10,
                border: '1px solid rgba(74,222,128,0.35)',
                background: 'rgba(74,222,128,0.1)',
                color: 'rgba(16,185,129,0.9)'
              }}
            >
              Данные сохранены. Добро пожаловать, {form.name.trim() || userName || 'друг'}!
            </div>
          )}
        </form>
      </div>

      <div className="card" style={{ padding: 18, display: 'grid', gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Тарифы</h3>
        <p className="note">
          Выберите тарифный план, чтобы открыть расширенные интерпретации и персональные рекомендации.
        </p>
        <button type="button" className="btn" style={{ maxWidth: 240 }}>
          Выбрать тарифный план
        </button>
      </div>

      {userRegistered && (
        <div className="card" style={{ padding: 18, display: 'grid', gap: 6 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Ваш профиль</h3>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            <div>Имя: {userName}</div>
            <div>E-mail: {userEmail}</div>
          </div>
        </div>
      )}
    </section>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  autoComplete?: string
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  autoComplete
}: FieldProps) {
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label htmlFor={inputId} style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 13, opacity: 0.7 }}>{label}</span>
      <input
        id={inputId}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
      />
      {error && (
        <span style={{ color: 'salmon', fontSize: 12 }}>
          {error}
        </span>
      )}
    </label>
  )
}


