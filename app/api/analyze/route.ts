
import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Migrated face analysis service from external Ark API to @google/genai as per guidelines.
export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    if (!image) {
      return NextResponse.json({ error: '法相缺失' }, { status: 400 });
    }

    // Initialize the Gemini API client using the environment variable.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Use gemini-3-pro-preview for complex reasoning tasks involving multimodal input and detailed JSON reports.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          parts: [
            { text: "请基于提供的法相（照片）进行深度心性推演。结合传统《公笃相法》等相理与现代演化心理学。请输出详细的专业解析。" },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: image,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: `你是一位融合了传统《公笃相法》、《神相全编》与现代演化心理学的顶级相学宗师。
你的任务是根据用户的“法相”（照片），进行深度心性推演。

请遵循以下专业准则：
1. **察其骨法**：观察额骨（天庭）、鼻骨、颧骨的走势。
2. **辨其精神**：从眼神的聚散（神藏、神露）判断内在意志。
3. **明其三停**：上停主早年与天资，中停主中年与毅力，下停主晚年与格局。

输出必须极其专业、优雅且富有洞察力。严禁任何额外解释。`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            fiveElement: { type: Type.STRING },
            elementAnalysis: { type: Type.STRING },
            masterInsight: {
              type: Type.OBJECT,
              properties: {
                poem: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["poem", "summary"],
            },
            observations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  description: { type: Type.STRING },
                  significance: { type: Type.STRING },
                },
                required: ["feature", "description", "significance"],
              },
            },
            palaces: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  analysis: { type: Type.STRING },
                },
                required: ["name", "status", "analysis"],
              },
            },
            riskMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  traditionalTerm: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["label", "value", "traditionalTerm", "description"],
              },
            },
            karma: {
              type: Type.OBJECT,
              properties: {
                past: { type: Type.STRING },
                present: { type: Type.STRING },
                future: { type: Type.STRING },
              },
              required: ["past", "present", "future"],
            },
            workplace: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                advice: { type: Type.STRING },
                compatibility: { type: Type.STRING },
              },
              required: ["role", "strengths", "advice", "compatibility"],
            },
            personalityProfile: { type: Type.STRING },
            socialGuide: { type: Type.STRING },
            hobbies: { type: Type.ARRAY, items: { type: Type.STRING } },
            auraStatus: { type: Type.STRING },
            auraMessage: { type: Type.STRING },
            moles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  position: { type: Type.STRING },
                  nature: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["position", "nature", "meaning"],
              },
            },
          },
          required: [
            "score", "fiveElement", "elementAnalysis", "masterInsight", "observations",
            "palaces", "riskMetrics", "karma", "workplace", "personalityProfile",
            "socialGuide", "hobbies", "auraStatus", "auraMessage", "moles"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('宗师灵鉴中断');
    }
    
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: '玄机难测，系统处理失败' }, { status: 500 });
  }
}
