import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Empresa, Empleado } from '../types'

type AuthState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success' }

function sessionKey(token: string) {
  return `mb_employee_${token}`
}

export function useEmployeeAuth(empresa: Empresa | null, token: string | undefined) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle' })

  useEffect(() => {
    if (!token) return
    const stored = sessionStorage.getItem(sessionKey(token))
    if (!stored) return
    try {
      setEmpleado(JSON.parse(stored) as Empleado)
    } catch {
      sessionStorage.removeItem(sessionKey(token))
    }
  }, [token])

  async function login(nombreApellido: string, password: string) {
    if (!empresa) return
    setAuthState({ status: 'loading' })

    if (empresa.password_catalogo !== password) {
      setAuthState({ status: 'error', message: 'Contraseña incorrecta. Verificá los datos.' })
      return
    }

    const { data: emp, error } = await supabase
      .from('empleados')
      .select('*')
      .eq('empresa_id', empresa.id)
      .ilike('nombre_apellido', nombreApellido.trim())
      .maybeSingle()

    if (error || !emp) {
      setAuthState({
        status: 'error',
        message: 'Tu nombre no figura en la lista. Verificá cómo fue registrado o contactá a tu empresa.',
      })
      return
    }

    if (emp.pedido_realizado) {
      setAuthState({
        status: 'error',
        message: 'Ya enviaste tu pedido. Si necesitás hacer un cambio, contactá a Mundo Barrilete.',
      })
      return
    }

    if (token) sessionStorage.setItem(sessionKey(token), JSON.stringify(emp))
    setEmpleado(emp)
    setAuthState({ status: 'success' })
  }

  function clearSession() {
    if (token) sessionStorage.removeItem(sessionKey(token))
    setEmpleado(null)
    setAuthState({ status: 'idle' })
  }

  return { empleado, authState, login, clearSession }
}
