
import { AnalysisResult } from "../types";

/**
 * 客户端服务：向本地 API 发起灵鉴请求
 * 请求会被转发至集成了火山方舟 API 的后端路由进行处理。
 */
export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `灵鉴中断 (状态码: ${response.status})`);
    }

    const result = await response.json();
    return result as AnalysisResult;
  } catch (error: any) {
    console.error("客户端调用异常:", error);
    throw new Error(error.message || "法相难辨，师门传讯异常");
  }
};
