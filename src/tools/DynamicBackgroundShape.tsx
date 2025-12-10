import {
  HTMLContainer,
  BaseBoxShapeUtil,
  TLBaseShape,
  TLImageExportOptions,
  T,
} from "tldraw";
import {
  GradientFlowBackground,
  HeatmapBackground,
  GrainGradientBackground,
} from "../components/dynamic-backgrounds";
import {
  backgroundTypeStyle,
  animationSpeedStyle,
  primaryColorStyle,
  secondaryColorStyle,
  heatmapColorsStyle,
  heatmapColorBackStyle,
  heatmapContourStyle,
  heatmapAngleStyle,
  heatmapNoiseStyle,
  heatmapInnerGlowStyle,
  heatmapOuterGlowStyle,
  heatmapScaleStyle,
  heatmapImageStyle,
  grainColorsStyle,
  grainColorBackStyle,
  grainSoftnessStyle,
  grainIntensityStyle,
  grainNoiseStyle,
  grainShapeStyle,
  type BackgroundType,
  type AnimationSpeed,
  type PrimaryColor,
  type SecondaryColor,
  type HeatmapColors,
  type HeatmapColorBack,
  type HeatmapContour,
  type HeatmapAngle,
  type HeatmapNoise,
  type HeatmapInnerGlow,
  type HeatmapOuterGlow,
  type HeatmapScale,
  type HeatmapImage,
  type GrainColors,
  type GrainColorBack,
  type GrainSoftness,
  type GrainIntensity,
  type GrainNoise,
  type GrainShape,
} from "../styles/dynamic-background-styles";

/**
 * 动态背景形状属性定义
 */
export interface DynamicBackgroundShapeProps {
  w: number;
  h: number;
  backgroundType: BackgroundType;
  animationSpeed: AnimationSpeed;
  primaryColor: PrimaryColor;
  secondaryColor: SecondaryColor;
  // Heatmap 特有属性
  heatmapColors?: HeatmapColors;
  heatmapColorBack?: HeatmapColorBack;
  heatmapContour?: HeatmapContour;
  heatmapAngle?: HeatmapAngle;
  heatmapNoise?: HeatmapNoise;
  heatmapInnerGlow?: HeatmapInnerGlow;
  heatmapOuterGlow?: HeatmapOuterGlow;
  heatmapScale?: HeatmapScale;
  heatmapImage?: HeatmapImage;
  // Grain Gradient 特有属性
  grainColors?: GrainColors;
  grainColorBack?: GrainColorBack;
  grainSoftness?: GrainSoftness;
  grainIntensity?: GrainIntensity;
  grainNoise?: GrainNoise;
  grainShape?: GrainShape;
}

/**
 * 动态背景形状类型定义
 */
export interface DynamicBackgroundShape
  extends TLBaseShape<"dynamic-background", DynamicBackgroundShapeProps> {
}

/**
 * 动态背景形状工具类
 *
 * 设计目的：
 * - 在Tldraw画布上创建动态背景容器
 * - 每个容器显示不同的CSS动画背景效果
 * - 作为其他白板元素的视觉背景层
 * - 支持拖拽、缩放、删除等基本操作
 */
export class DynamicBackgroundShapeUtil extends BaseBoxShapeUtil<DynamicBackgroundShape> {
  static override type = "dynamic-background" as const;

  // 使用新的样式系统定义形状属性
  static override props = {
    w: T.number,
    h: T.number,
    backgroundType: backgroundTypeStyle,
    animationSpeed: animationSpeedStyle,
    primaryColor: primaryColorStyle,
    secondaryColor: secondaryColorStyle,
    // Heatmap 特有属性
    heatmapColors: heatmapColorsStyle,
    heatmapColorBack: heatmapColorBackStyle,
    heatmapContour: heatmapContourStyle,
    heatmapAngle: heatmapAngleStyle,
    heatmapNoise: heatmapNoiseStyle,
    heatmapInnerGlow: heatmapInnerGlowStyle,
    heatmapOuterGlow: heatmapOuterGlowStyle,
    heatmapScale: heatmapScaleStyle,
    heatmapImage: heatmapImageStyle,
    // Grain Gradient 特有属性
    grainColors: grainColorsStyle,
    grainColorBack: grainColorBackStyle,
    grainSoftness: grainSoftnessStyle,
    grainIntensity: grainIntensityStyle,
    grainNoise: grainNoiseStyle,
    grainShape: grainShapeStyle,
  };

  // 形状是否可以选择和编辑
  override canBind = () => false;
  override canEdit = () => false;
  override canUnmount = () => false;

  // 默认形状属性
  override getDefaultProps(): DynamicBackgroundShape["props"] {
    return {
      w: 600,
      h: 400,
      backgroundType: "gradient-flow",
      animationSpeed: 1.0,
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      // Heatmap 默认值
      heatmapColors: "#112069,#1f3ca3,#3265e7,#6bd8ff,#ffe77a,#ff9a1f,#ff4d00",
      heatmapColorBack: "#000000",
      heatmapContour: 0.5,
      heatmapAngle: 0,
      heatmapNoise: 0,
      heatmapInnerGlow: 0.5,
      heatmapOuterGlow: 0.5,
      heatmapScale: 0.75,
      heatmapImage: "https://shaders.paper.design/images/logos/diamond.svg",
      // Grain Gradient 默认值
      grainColors: "#702200,#eaba7b,#38b422",
      grainColorBack: "#0a0000",
      grainSoftness: 0,
      grainIntensity: 0.2,
      grainNoise: 1,
      grainShape: "sphere",
    };
  }

  // 获取组件，用于渲染React组件
  override component(shape: DynamicBackgroundShape) {
    // 预览模式：使用简单的半透明方块
    if (shape.opacity < 0.8) {
      return (
        <HTMLContainer
          id={shape.id}
          style={{
            width: shape.props.w,
            height: shape.props.h,
            pointerEvents: "none", // 预览模式下不响应交互
            opacity: shape.opacity,
          }}
        >
          <div className="w-full h-full bg-gray-400 border border-gray-400" />
        </HTMLContainer>
      );
    }

    // 正常模式：渲染完整的动态背景组件
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: shape.isLocked ? "none" : "auto",
          opacity: shape.opacity,
        }}
      >
        <div className="w-full h-full overflow-hidden">
          {this.renderBackgroundComponent(shape)}
        </div>
      </HTMLContainer>
    );
  }

  // 获取背景组件的渲染函数
  private renderBackgroundComponent(shape: DynamicBackgroundShape) {
    const { backgroundType, animationSpeed, primaryColor, secondaryColor } =
      shape.props;

    switch (backgroundType) {
      case "gradient-flow":
        return (
          <GradientFlowBackground
            animationSpeed={animationSpeed}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      case "heatmap":
        // 解析颜色字符串为数组
        const colors = shape.props.heatmapColors?.split(",") || [
          "#112069",
          "#1f3ca3",
          "#3265e7",
          "#6bd8ff",
          "#ffe77a",
          "#ff9a1f",
          "#ff4d00",
        ];
        return (
          <HeatmapBackground
            width={shape.props.w}
            height={shape.props.h}
            colors={colors}
            colorBack={shape.props.heatmapColorBack}
            contour={shape.props.heatmapContour}
            angle={shape.props.heatmapAngle}
            noise={shape.props.heatmapNoise}
            innerGlow={shape.props.heatmapInnerGlow}
            outerGlow={shape.props.heatmapOuterGlow}
            scale={shape.props.heatmapScale}
            image={shape.props.heatmapImage}
            speed={animationSpeed}
          />
        );
      case "grain-gradient":
        // 解析GrainGradient颜色字符串为数组
        const grainColors = shape.props.grainColors?.split(",") || [
          "#702200",
          "#eaba7b",
          "#38b422",
        ];
        return (
          <GrainGradientBackground
            colors={grainColors}
            colorBack={shape.props.grainColorBack}
            softness={shape.props.grainSoftness}
            intensity={shape.props.grainIntensity}
            noise={shape.props.grainNoise}
            shape={shape.props.grainShape}
            speed={animationSpeed}
          />
        );
      default:
        return (
          <GradientFlowBackground
            animationSpeed={animationSpeed}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
    }
  }

  // 获取指示器（选中时显示的边框和调整手柄）
  override indicator(shape: DynamicBackgroundShape) {
    const { w, h } = shape.props;
    return (
      <rect width={w} height={h} fill="none" stroke="#007AFF" strokeWidth={2} />
    );
  }

  // 导出为图片时的处理
  override async toImage(
    shape: DynamicBackgroundShape,
    opts: TLImageExportOptions
  ): Promise<HTMLImageElement | null> {
    // 动态背景导出为静态图片（截图）
    const element = document.querySelector(
      `[data-shape="${shape.id}"]`
    ) as HTMLElement;
    if (!element) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 创建一个简单的渐变背景作为静态导出
    const gradient = ctx.createLinearGradient(
      0,
      0,
      shape.props.w,
      shape.props.h
    );
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, shape.props.w, shape.props.h);

    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }

  // 处理形状属性更新
  override onResize = (shape: DynamicBackgroundShape, info: any) => {
    const { newPoint, initialBounds, scaleX, scaleY } = info;

    // 计算新的宽度和高度
    const newWidth = Math.max(200, initialBounds.w * scaleX);
    const newHeight = Math.max(150, initialBounds.h * scaleY);

    // 确保我们不会得到 NaN
    if (isNaN(newWidth) || isNaN(newHeight)) {
      console.warn("Invalid dimensions detected, skipping resize");
      return shape;
    }

    return {
      ...shape,
      props: {
        ...shape.props,
        w: newWidth,
        h: newHeight,
      },
    };
  };

  // 处理背景类型变更（通过工具管理器调用）
  changeBackgroundType(
    shape: DynamicBackgroundShape,
    backgroundType: DynamicBackgroundShape["props"]["backgroundType"]
  ) {
    return {
      ...shape,
      props: {
        ...shape.props,
        backgroundType,
      },
    };
  }
}
