import { useMemo } from 'react'
import usePhase from '../hooks/usePhase'

interface ProgressWavyProps {
    progress?: number
    speed?: number
    width?: number
    height?: number
    stroke?: number
    amplitude?: number
    headRampFraction?: number
    trackColor?: string
    color?: string
}

const SVG_WIDTH = 400
const SVG_HEIGHT = 40
const CENTER_Y = 20
const WAVELENGTH = 55
const STROKE_WIDTH = 8
const MARGIN = STROKE_WIDTH / 2
const MAX_AMPLITUDE = 4
const HEAD_RAMP_FRACTION = 0.28
const TRACK_OFFSET = 6
const GAP_OFFSET = 5
const SPEED = 0.01

export const Progress = (props: ProgressWavyProps) => {
    const {
        progress = 0,
        speed = SPEED,
        headRampFraction = HEAD_RAMP_FRACTION,
        stroke = STROKE_WIDTH,
        height = SVG_HEIGHT,
        amplitude = MAX_AMPLITUDE,
        width = SVG_WIDTH,
        trackColor = '#524B6B',
        color = '#c3a6ff',
    } = props

    const phase = usePhase(speed)

    const progressPct = useMemo(() => Math.min(100, progress), [progress])
    const showTrack = useMemo(() => progressPct < 100, [progressPct])

    const currentLength = useMemo(() => {
        const usableWidth = width - MARGIN * 2 - TRACK_OFFSET * 2
        return (usableWidth * Math.min(100, progress)) / 100
    }, [progress, width])

    const progressWidth = useMemo(() => {
        return Math.min(
            MARGIN + TRACK_OFFSET + currentLength + stroke / 2,
            showTrack ? width - GAP_OFFSET : width,
        )
    }, [currentLength, stroke, width])

    const generatePath = useMemo(() => {
        const points: string[] = []

        if (currentLength <= 0) return ''

        for (let x = 0; x <= currentLength; x += 1) {
            const realX = MARGIN + TRACK_OFFSET + x

            const rampEnd = currentLength * headRampFraction
            const currentAmplitude = x <= rampEnd ? amplitude * (x / rampEnd) : amplitude

            const y = Math.sin((x / (WAVELENGTH / (2 * Math.PI))) - phase) * currentAmplitude + CENTER_Y

            if (x === 0) {
                points.push(`M ${ realX } ${ y }`)
            } else {
                points.push(`L ${ realX } ${ y }`)
            }
        }

        return points.join(' ')
    }, [progress, phase, headRampFraction, amplitude])

    return <div
        style={ {
            display: 'flex',
            alignItems: 'center',
            width: width,
            height: height,
        } }
    >
        <div
            style={ {
                width: progressWidth,
                minWidth: 0,
                overflow: 'hidden',
                flexShrink: 0,
            } }
        >
            <svg
                width={ width }
                height={ height }
                viewBox={ `0 0 ${ width } ${ height }` }
                style={ { display: 'block', verticalAlign: 'middle' } }
            >

                <path
                    d={ generatePath }
                    stroke={ color }
                    strokeWidth={ stroke }
                    strokeLinecap={ 'round' }
                    fill={ 'none' }
                />
            </svg>
        </div>

        { showTrack && <>
            <div style={ { width: GAP_OFFSET, flexShrink: 0 } }/>
            <div
                style={ {
                    flex: 1,
                    height: stroke,
                    minWidth: 0,
                    backgroundColor: trackColor,
                    borderRadius: stroke / 2,
                } }
            />
        </> }
    </div>
}