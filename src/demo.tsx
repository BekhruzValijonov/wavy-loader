import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import { CircularWavyProgress, Progress } from './index'

function Demo() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let count = 0
        let timer = 0
        let isPaused = false

        const pauseProgress = () => {
            isPaused = true
            clearInterval(timer)

            setTimeout(() => {
                isPaused = false
                startInterval()
            }, 7000)
        }

        const startInterval = () => {
            // @ts-ignore
            timer = setInterval(() => {
                if (isPaused) return

                count++
                setProgress(count)

                if (count === 50 || count === 60 || count === 10 || count === 20 || count === 99) {
                    pauseProgress()
                }

                if (count >= 1050) {
                    count = 0
                }
            }, 25)
        }

        startInterval()

        return () => {
            clearInterval(timer)
        }
    }, [])


 return <>
     <Progress progress={ progress }/>
     <CircularWavyProgress progress={ progress }/>
 </>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Demo/>
  </React.StrictMode>
)
