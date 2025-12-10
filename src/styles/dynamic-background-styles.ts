import { StyleProp } from 'tldraw'
import { T } from '@tldraw/validate'

// 动态背景类型样式
export const backgroundTypeStyle = StyleProp.defineEnum('dynamic-background:type', {
	defaultValue: 'gradient-flow',
	values: ['gradient-flow', 'heatmap', 'grain-gradient'] as const,
})

// 动画速度样式
export const animationSpeedStyle = StyleProp.define('dynamic-background:animationSpeed', {
	defaultValue: 1.0,
	type: T.number.check((n) => {
		if (n < 0.1 || n > 3.0) {
			throw new Error('Animation speed must be between 0.1 and 3.0')
		}
	}),
})

// 主色调样式
export const primaryColorStyle = StyleProp.define('dynamic-background:primaryColor', {
	defaultValue: '#3b82f6',
	type: T.string,
})

// 次色调样式
export const secondaryColorStyle = StyleProp.define('dynamic-background:secondaryColor', {
	defaultValue: '#8b5cf6',
	type: T.string,
})

// Heatmap 特有样式属性
export const heatmapColorsStyle = StyleProp.define('dynamic-background:heatmapColors', {
	defaultValue: '#112069,#1f3ca3,#3265e7,#6bd8ff,#ffe77a,#ff9a1f,#ff4d00',
	type: T.string,
})

export const heatmapColorBackStyle = StyleProp.define('dynamic-background:heatmapColorBack', {
	defaultValue: '#000000',
	type: T.string,
})

export const heatmapContourStyle = StyleProp.define('dynamic-background:heatmapContour', {
	defaultValue: 0.5,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Contour must be between 0 and 1')
		}
	}),
})

export const heatmapAngleStyle = StyleProp.define('dynamic-background:heatmapAngle', {
	defaultValue: 0,
	type: T.number.check((n) => {
		if (n < 0 || n > 360) {
			throw new Error('Angle must be between 0 and 360')
		}
	}),
})

export const heatmapNoiseStyle = StyleProp.define('dynamic-background:heatmapNoise', {
	defaultValue: 0,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Noise must be between 0 and 1')
		}
	}),
})

export const heatmapInnerGlowStyle = StyleProp.define('dynamic-background:heatmapInnerGlow', {
	defaultValue: 0.5,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Inner glow must be between 0 and 1')
		}
	}),
})

export const heatmapOuterGlowStyle = StyleProp.define('dynamic-background:heatmapOuterGlow', {
	defaultValue: 0.5,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Outer glow must be between 0 and 1')
		}
	}),
})

export const heatmapScaleStyle = StyleProp.define('dynamic-background:heatmapScale', {
	defaultValue: 0.75,
	type: T.number.check((n) => {
		if (n < 0.01 || n > 4) {
			throw new Error('Scale must be between 0.01 and 4')
		}
	}),
})

export const heatmapImageStyle = StyleProp.define('dynamic-background:heatmapImage', {
	defaultValue: 'https://shaders.paper.design/images/logos/diamond.svg',
	type: T.string,
})

// Grain Gradient 特有样式属性
export const grainColorsStyle = StyleProp.define('dynamic-background:grainColors', {
	defaultValue: '#702200,#eaba7b,#38b422',
	type: T.string,
})

export const grainColorBackStyle = StyleProp.define('dynamic-background:grainColorBack', {
	defaultValue: '#0a0000',
	type: T.string,
})

export const grainSoftnessStyle = StyleProp.define('dynamic-background:grainSoftness', {
	defaultValue: 0,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Softness must be between 0 and 1')
		}
	}),
})

export const grainIntensityStyle = StyleProp.define('dynamic-background:grainIntensity', {
	defaultValue: 0.2,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Intensity must be between 0 and 1')
		}
	}),
})

export const grainNoiseStyle = StyleProp.define('dynamic-background:grainNoise', {
	defaultValue: 1,
	type: T.number.check((n) => {
		if (n < 0 || n > 1) {
			throw new Error('Noise must be between 0 and 1')
		}
	}),
})

export const grainShapeStyle = StyleProp.defineEnum('dynamic-background:grainShape', {
	defaultValue: 'sphere',
	values: ['wave', 'dots', 'truchet', 'corners', 'ripple', 'blob', 'sphere'] as const,
})

// 导出所有样式类型
export const dynamicBackgroundStyles = {
	backgroundType: backgroundTypeStyle,
	animationSpeed: animationSpeedStyle,
	primaryColor: primaryColorStyle,
	secondaryColor: secondaryColorStyle,
	heatmapColors: heatmapColorsStyle,
	heatmapColorBack: heatmapColorBackStyle,
	heatmapContour: heatmapContourStyle,
	heatmapAngle: heatmapAngleStyle,
	heatmapNoise: heatmapNoiseStyle,
	heatmapInnerGlow: heatmapInnerGlowStyle,
	heatmapOuterGlow: heatmapOuterGlowStyle,
	heatmapScale: heatmapScaleStyle,
	heatmapImage: heatmapImageStyle,
	grainColors: grainColorsStyle,
	grainColorBack: grainColorBackStyle,
	grainSoftness: grainSoftnessStyle,
	grainIntensity: grainIntensityStyle,
	grainNoise: grainNoiseStyle,
	grainShape: grainShapeStyle,
}

// 导出类型定义
export type BackgroundType = T.TypeOf<typeof backgroundTypeStyle>
export type AnimationSpeed = T.TypeOf<typeof animationSpeedStyle>
export type PrimaryColor = T.TypeOf<typeof primaryColorStyle>
export type SecondaryColor = T.TypeOf<typeof secondaryColorStyle>
export type HeatmapColors = T.TypeOf<typeof heatmapColorsStyle>
export type HeatmapColorBack = T.TypeOf<typeof heatmapColorBackStyle>
export type HeatmapContour = T.TypeOf<typeof heatmapContourStyle>
export type HeatmapAngle = T.TypeOf<typeof heatmapAngleStyle>
export type HeatmapNoise = T.TypeOf<typeof heatmapNoiseStyle>
export type HeatmapInnerGlow = T.TypeOf<typeof heatmapInnerGlowStyle>
export type HeatmapOuterGlow = T.TypeOf<typeof heatmapOuterGlowStyle>
export type HeatmapScale = T.TypeOf<typeof heatmapScaleStyle>
export type HeatmapImage = T.TypeOf<typeof heatmapImageStyle>
export type GrainColors = T.TypeOf<typeof grainColorsStyle>
export type GrainColorBack = T.TypeOf<typeof grainColorBackStyle>
export type GrainSoftness = T.TypeOf<typeof grainSoftnessStyle>
export type GrainIntensity = T.TypeOf<typeof grainIntensityStyle>
export type GrainNoise = T.TypeOf<typeof grainNoiseStyle>
export type GrainShape = T.TypeOf<typeof grainShapeStyle>