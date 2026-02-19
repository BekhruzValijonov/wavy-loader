import { useState, useCallback, useEffect, useRef } from 'react'

function usePhase(speed: number): number {
    const [phase, setPhase] = useState(0)
    const requestRef = useRef<number>(0)

    const animate = useCallback((time: number) => {
        setPhase(time * speed)
        requestRef.current = requestAnimationFrame(animate)
    }, [speed])

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(requestRef.current)
        }
    }, [animate])

    return phase
}

export default usePhase
