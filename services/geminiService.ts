
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FiveElement } from "../types";

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    作为面相学（Mian Xiang）和现代面部心理学专家，请分析这张人脸图片。
    
    分析维度：
    1. 五行属性：判定其金、木、水、火、土形脸。
    2. 十二宫位：分析关键宫位（命宫、财帛等）的状态。
    3. 现代风险指标：通过 fWHR 和五官形态评估性格侵略性与情绪风险。
    4. 三世因果：从面相骨骼深度推演前世积淀、今生性格成因、未来愿景。
    5. 职场匹配：分析最适合的职场角色、优势及协作策略。
    6. 生活方式：侧写、社交指南、爱好及今日气色。
    
    语言：必须使用优雅、专业的中文。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            fiveElement: { type: Type.STRING, enum: Object.values(FiveElement) },
            elementAnalysis: { type: Type.STRING },
            palaces: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  analysis: { type: Type.STRING }
                },
                required: ["name", "status", "analysis"]
              }
            },
            riskMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  traditionalTerm: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["label", "value", "traditionalTerm", "description"]
              }
            },
            karma: {
              type: Type.OBJECT,
              properties: {
                past: { type: Type.STRING, description: "前世因：性格中潜藏的宿命感" },
                present: { type: Type.STRING, description: "今生果：当下容貌呈现的性格现状" },
                future: { type: Type.STRING, description: "未来愿：面相透出的发展愿景" }
              },
              required: ["past", "present", "future"]
            },
            workplace: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, description: "职场角色标签" },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                advice: { type: Type.STRING, description: "职场发展与协作建议" },
                compatibility: { type: Type.STRING, description: "理想队友特质" }
              },
              required: ["role", "strengths", "advice", "compatibility"]
            },
            personalityProfile: { type: Type.STRING },
            socialGuide: { type: Type.STRING },
            hobbies: { type: Type.ARRAY, items: { type: Type.STRING } },
            auraStatus: { type: Type.STRING },
            auraMessage: { type: Type.STRING }
          },
          required: [
            "score", "fiveElement", "elementAnalysis", "palaces", "riskMetrics", 
            "karma", "workplace", "personalityProfile", "socialGuide", "hobbies", 
            "auraStatus", "auraMessage"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回数据");
    return JSON.parse(text.trim()) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
