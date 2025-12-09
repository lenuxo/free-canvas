import { StyleProp } from 'tldraw'
import { T } from '@tldraw/validate'

// 动态背景类型样式
export const backgroundTypeStyle = StyleProp.defineEnum('dynamic-background:type', {
	defaultValue: 'gradient-flow',
	values: ['gradient-flow'] as const,
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

// 导出所有样式类型
export const dynamicBackgroundStyles = {
	backgroundType: backgroundTypeStyle,
	animationSpeed: animationSpeedStyle,
	primaryColor: primaryColorStyle,
	secondaryColor: secondaryColorStyle,
}

// 导出类型定义
export type BackgroundType = T.TypeOf<typeof backgroundTypeStyle>
export type AnimationSpeed = T.TypeOf<typeof animationSpeedStyle>
export type PrimaryColor = T.TypeOf<typeof primaryColorStyle>
export type SecondaryColor = T.TypeOf<typeof secondaryColorStyle>