import { useState, useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js'
import TeacherLayout from '../../components/TeacherLayout'
import teacherApi from '../../services/teacherApi'

const MODEL_URL = '/models'

export default function Attendance() {
  const videoRef  = useRef(null)
  const streamRef = useRef(null)

  const [modelsLoaded,   setModelsLoaded]   = useState(false)
  const [cameraOn,       setCameraOn]       = useState(false)
  const [status,         setStatus]         = useState('idle')
  const [message,        setMessage]        = useState('')
  const [todayMarked,    setTodayMarked]    = useState(false)
  const [faceRegistered, setFaceRegistered] = useState(false)
  const [registerMode,   setRegisterMode]   = useState(false)
  const [monthData,      setMonthData]      = useState({ present: 0, total: 0, records: [] })
  const [selectedMonth,  setSelectedMonth]  = useState(new Date().toISOString().substring(0, 7))
  const [modelError,     setModelError]     = useState('')
  const [countdown,      setCountdown]      = useState(0)
  const scanDoneRef = useRef(false)

  const today = new Date().toISOString().split('T')[0]

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
      } catch (err) {
        setModelError('Models load nahi hue: ' + err.message)
      }
    }
    loadModels()
  }, [])

  // Fetch data
  useEffect(() => {
    teacherApi.get(`/teachers/attendance/my?month=${selectedMonth}`)
      .then(r => {
        const data = r.data.data
        setMonthData({ present: data.presentCount || 0, total: data.total || 0, records: data.attendance || [] })
        setTodayMarked(!!data.attendance?.find(a => a.date === today))
      }).catch(() => {})

    teacherApi.get('/teachers/me')
      .then(r => setFaceRegistered((r.data.data?.faceDescriptor?.length || 0) > 0))
      .catch(() => {})
  }, [selectedMonth])

  // Attach video stream
  useEffect(() => {
    if (cameraOn && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [cameraOn])

  // Auto scan after camera opens
  useEffect(() => {
    if (cameraOn && modelsLoaded) {
      scanDoneRef.current = false
      startCountdown()
    }
  }, [cameraOn])

  const startCountdown = () => {
    setCountdown(3)
    setStatus('countdown')
    setMessage('Camera tayyar ho raha hai...')

    let count = 3
    const timer = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(timer)
        setCountdown(0)
        if (registerMode) {
          autoRegisterFace()
        } else {
          autoMarkAttendance()
        }
      }
    }, 1000)
  }

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setMessage('Browser camera support nahi karta.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      setCameraOn(true)
      setStatus('idle')
      setMessage('')
    } catch (err) {
      setStatus('error')
      if (err.name === 'NotAllowedError') {
        setMessage('Camera permission deny hai. Browser settings mein allow karo.')
      } else {
        setMessage('Camera error: ' + err.message)
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
    setStatus('idle')
    setMessage('')
    setCountdown(0)
    scanDoneRef.current = false
  }

  const detectFace = async () => {
    if (!videoRef.current) return null
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
    return await faceapi
      .detectSingleFace(videoRef.current, options)
      .withFaceLandmarks()
      .withFaceDescriptor()
  }

  // Auto register — no button needed
  const autoRegisterFace = async () => {
    if (scanDoneRef.current) return
    scanDoneRef.current = true
    setStatus('scanning')
    setMessage('Face scan ho raha hai...')

    // Try multiple times
    let detection = null
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 500))
      detection = await detectFace()
      if (detection) break
      setMessage(`Face dhundh raha hai... (${i + 1}/5)`)
    }

    if (!detection) {
      setStatus('error')
      setMessage('Face detect nahi hua. Achhi roshni mein camera ki taraf seedha dekho.')
      scanDoneRef.current = false
      return
    }

    try {
      const descriptor = Array.from(detection.descriptor)
      await teacherApi.post('/teachers/face/save', { descriptor })
      setFaceRegistered(true)
      setStatus('success')
      setMessage('✅ Face register ho gaya!')
      setRegisterMode(false)
      setTimeout(() => stopCamera(), 2000)
    } catch (err) {
      setStatus('error')
      setMessage('Save fail: ' + err.message)
      scanDoneRef.current = false
    }
  }

  // Auto attendance — no button needed
  const autoMarkAttendance = async () => {
    if (scanDoneRef.current) return
    scanDoneRef.current = true
    setStatus('scanning')
    setMessage('Face scan ho raha hai...')

    try {
      const meRes = await teacherApi.get('/teachers/me')
      const savedDescriptor = meRes.data.data?.faceDescriptor

      if (!savedDescriptor || savedDescriptor.length === 0) {
        setStatus('error')
        setMessage('Face register nahi hai! Pehle face register karo.')
        scanDoneRef.current = false
        return
      }

      // Try multiple times
      let detection = null
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 500))
        detection = await detectFace()
        if (detection) break
        setMessage(`Face dhundh raha hai... (${i + 1}/5)`)
      }

      if (!detection) {
        setStatus('error')
        setMessage('Face detect nahi hua. Seedha camera ki taraf dekho.')
        scanDoneRef.current = false
        return
      }

      const distance = faceapi.euclideanDistance(
        detection.descriptor,
        new Float32Array(savedDescriptor)
      )

      if (distance > 0.6) {
        setStatus('error')
        setMessage(`Face match nahi hua. Dobara try karo.`)
        scanDoneRef.current = false
        return
      }

      await teacherApi.post('/teachers/attendance/mark', { method: 'face' })
      setTodayMarked(true)
      setStatus('success')
      setMessage('✅ Attendance mark ho gayi!')
      setTimeout(() => stopCamera(), 2000)

      const attRes = await teacherApi.get(`/teachers/attendance/my?month=${selectedMonth}`)
      const data = attRes.data.data
      setMonthData({ present: data.presentCount || 0, total: data.total || 0, records: data.attendance || [] })

    } catch (err) {
      if (err.response?.data?.message?.includes('already')) {
        setStatus('success')
        setMessage('✅ Aaj ki attendance pehle se mark hai!')
        setTodayMarked(true)
        setTimeout(() => stopCamera(), 2000)
      } else {
        setStatus('error')
        setMessage('Error: ' + err.message)
        scanDoneRef.current = false
      }
    }
  }

  const getDaysInMonth = () => {
    const [y, m] = selectedMonth.split('-')
    return new Date(y, m, 0).getDate()
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-800">My Attendance</h2>
          <input type="month" value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {/* Model Error */}
        {modelError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">❌ {modelError}</div>
        )}

        {/* Models Loading */}
        {!modelsLoaded && !modelError && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-700 text-sm">Face models load ho rahe hain...</p>
          </div>
        )}

        {/* Today Status */}
        <div className={`rounded-xl p-5 flex items-center justify-between flex-wrap gap-3 ${
          todayMarked ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{todayMarked ? '✅' : '⏰'}</span>
            <div>
              <p className={`font-semibold ${todayMarked ? 'text-green-800' : 'text-yellow-800'}`}>
                {todayMarked ? 'Aaj Present Ho!' : 'Aaj attendance nahi lagi'}
              </p>
              <p className={`text-sm ${todayMarked ? 'text-green-600' : 'text-yellow-600'}`}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {!todayMarked && modelsLoaded && !cameraOn && (
            <button onClick={() => { setRegisterMode(false); startCamera() }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              📸 Mark Attendance
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{monthData.present}</p>
            <p className="text-gray-500 text-xs mt-1">Present</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-500">{getDaysInMonth() - monthData.present}</p>
            <p className="text-gray-500 text-xs mt-1">Absent</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">
              {getDaysInMonth() > 0 ? Math.round((monthData.present / getDaysInMonth()) * 100) : 0}%
            </p>
            <p className="text-gray-500 text-xs mt-1">Rate</p>
          </div>
        </div>

        {/* Face Not Registered */}
        {!faceRegistered && modelsLoaded && !cameraOn && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😶</span>
              <div>
                <p className="font-semibold text-red-800">Face register nahi hai!</p>
                <p className="text-red-600 text-sm">Camera khulega aur automatically face register ho jayega</p>
              </div>
            </div>
            <button onClick={() => { setRegisterMode(true); startCamera() }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">
              📸 Register Face
            </button>
          </div>
        )}

        {/* Re-register */}
        {faceRegistered && !cameraOn && modelsLoaded && (
          <button onClick={() => { setRegisterMode(true); startCamera() }}
            className="text-sm text-gray-400 hover:text-green-600 transition underline">
            Re-register face
          </button>
        )}

        {/* Error without camera */}
        {status === 'error' && !cameraOn && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {message}
          </div>
        )}

        {/* Camera Section */}
        {cameraOn && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-semibold text-gray-800">
                {registerMode ? '📸 Face Register ho raha hai' : '📸 Attendance Mark ho rahi hai'}
              </p>
              <button onClick={stopCamera} className="text-gray-400 hover:text-red-500 text-sm">
                ✕ Band karo
              </button>
            </div>

            <div className="p-4 flex flex-col items-center gap-4">
              {/* Video with countdown overlay */}
              <div className="relative rounded-xl overflow-hidden border-4 border-green-400">
                <video
                  ref={videoRef}
                  width="400"
                  height="300"
                  autoPlay
                  playsInline
                  muted
                  className="rounded-lg block bg-gray-900"
                />
                {/* Countdown overlay */}
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <span className="text-white text-8xl font-bold">{countdown}</span>
                  </div>
                )}
                {/* Scanning overlay */}
                {status === 'scanning' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 bg-opacity-80 py-2 text-white text-xs text-center">
                    Face scan ho raha hai...
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Camera ki taraf seedha dekho • Achhi roshni mein raho
              </p>

              {/* Status messages */}
              {status === 'scanning' && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">{message}</span>
                </div>
              )}
              {status === 'countdown' && (
                <p className="text-blue-600 text-sm font-medium">{message}</p>
              )}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm text-center w-full">
                  ❌ {message}
                  <button
                    onClick={() => { scanDoneRef.current = false; startCountdown() }}
                    className="block mx-auto mt-2 bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-600 transition">
                    Dobara Try karo
                  </button>
                </div>
              )}
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-600 text-sm text-center w-full">
                  {message}
                </div>
              )}

              {/* Cancel button */}
              {(status === 'error' || status === 'countdown') && (
                <button onClick={stopCamera}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Monthly Calendar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-800">Monthly Record</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-xs text-gray-400 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth() }, (_, i) => {
                const day     = i + 1
                const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`
                const record  = monthData.records.find(r => r.date === dateStr)
                const isToday = dateStr === today
                return (
                  <div key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                      record?.status === 'present' ? 'bg-green-500 text-white'
                      : isToday ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-800'
                      : 'bg-gray-50 text-gray-400'
                    }`}>
                    {day}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500" /> Present</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100 border" /> Absent</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-100 border-2 border-yellow-400" /> Today</div>
            </div>
          </div>
        </div>

      </div>
    </TeacherLayout>
  )
}