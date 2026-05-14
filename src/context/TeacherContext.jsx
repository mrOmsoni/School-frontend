import { createContext, useContext, useState, useEffect } from 'react'

const TeacherContext = createContext(null)

export function TeacherProvider({ children }) {
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('teacherToken')
    const data  = localStorage.getItem('teacherData')
    if (token && data) {
      setTeacher({ token, ...JSON.parse(data) })
    }
    setLoading(false)
  }, [])

  const login = (token, data) => {
    localStorage.setItem('teacherToken', token)
    localStorage.setItem('teacherData', JSON.stringify(data))
    setTeacher({ token, ...data })
  }

  const logout = () => {
    localStorage.removeItem('teacherToken')
    localStorage.removeItem('teacherData')
    setTeacher(null)
  }

  return (
    <TeacherContext.Provider value={{ teacher, login, logout, loading }}>
      {!loading && children}
    </TeacherContext.Provider>
  )
}

export const useTeacher = () => useContext(TeacherContext)