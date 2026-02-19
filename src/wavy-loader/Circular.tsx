import { useMemo } from 'react'
import usePhase from '../hooks/usePhase'

interface CircularProgressProps {
    progress?: number
    size?: number
    stroke?: number
    speed?: number
    trackColor?: string
    color?: string
}

const STROKE_WIDTH = 8
const MARGIN = STROKE_WIDTH / 2
const TRACK_OFFSET = 6
const GAP_OFFSET = 12
const WAVELENGTH_FACTOR = 12
const MAX_AMPLITUDE = STROKE_WIDTH / 2
const SPEED = 0.005
const FULL_CIRCLE = 2 * Math.PI
const TAIL_RAMP_RAD = 0.15
const HEAD_RAMP_RAD = 0.2

export const CircularWavyProgress = (props: CircularProgressProps) => {
    const {
        progress = 100,
        size = 220,
        stroke = STROKE_WIDTH,
        speed = SPEED,
        trackColor = '#524B6B',
        color = '#c3a6ff',
    } = props

    const phase = usePhase(speed)

    const center = useMemo(() => size / 2, [size])
    const progressPct = useMemo(() => Math.min(100, Math.max(0, progress)), [progress])
    const radius = useMemo(() => center - MARGIN - stroke / 2 - TRACK_OFFSET, [center, stroke])
    const gapAngle = useMemo(() => GAP_OFFSET / radius, [radius])

    const generatePath = useMemo(() => {
        const points: string[] = []

        const currentAngleLimit = (FULL_CIRCLE * progressPct) / 100

        if (currentAngleLimit <= 0) return ''

        const step = 0.02
        const headRampStart = currentAngleLimit - HEAD_RAMP_RAD
        const isHeadAtEnd = currentAngleLimit >= FULL_CIRCLE - HEAD_RAMP_RAD

        for (let angle = 0; angle <= currentAngleLimit; angle += step) {
            let envelope: number

            if (angle <= TAIL_RAMP_RAD) {
                envelope = angle / TAIL_RAMP_RAD
            } else if (isHeadAtEnd && angle >= headRampStart) {
                envelope = (currentAngleLimit - angle) / HEAD_RAMP_RAD
            } else {
                envelope = 1
            }

            const wave = Math.sin(angle * WAVELENGTH_FACTOR - phase)
            const r = radius + wave * MAX_AMPLITUDE * envelope
            const x = center + r * Math.cos(angle - Math.PI / 2)
            const y = center + r * Math.sin(angle - Math.PI / 2)

            if (angle === 0) {
                points.push(`M ${ x } ${ y }`)
            } else {
                points.push(`L ${ x } ${ y }`)
            }
        }

        return points.join(' ')
    }, [progressPct, phase, size, radius])

    const trackPath = useMemo(() => {
        const currentAngleLimit = (FULL_CIRCLE * progressPct) / 100
        const trackStart = currentAngleLimit + gapAngle
        const trackEnd = FULL_CIRCLE - gapAngle

        if (trackStart >= trackEnd) return ''

        const startX = center + radius * Math.cos(trackStart - Math.PI / 2)
        const startY = center + radius * Math.sin(trackStart - Math.PI / 2)
        const endX = center + radius * Math.cos(trackEnd - Math.PI / 2)
        const endY = center + radius * Math.sin(trackEnd - Math.PI / 2)
        const largeArc = trackEnd - trackStart > Math.PI ? 1 : 0

        return `M ${ startX } ${ startY } A ${ radius } ${ radius } 0 ${ largeArc } 1 ${ endX } ${ endY }`
    }, [progressPct, radius, gapAngle, center])

    return <div
        style={ {
            position: 'relative',
            width: size,
            height: size,
        } }
    >
        <svg
            width={ size }
            height={ size }
            viewBox={ `0 0 ${ size } ${ size }` }
            style={ {
                position: 'absolute',
                inset: 0,
                display: 'block',
            } }
        >
            { trackPath && <path
                d={ trackPath }
                stroke={ trackColor }
                strokeWidth={ stroke }
                strokeLinecap={ 'round' }
                fill={ 'none' }
            /> }

            <path
                d={ generatePath }
                stroke={ color }
                strokeWidth={ stroke }
                strokeLinecap={ 'round' }
                strokeLinejoin={ 'round' }
                fill={ 'none' }
            />
        </svg>
    </div>
}