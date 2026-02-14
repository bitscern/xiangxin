
import { NextResponse } from 'next/server';

/**
 * 相心灵鉴后端路由 - 火山方舟适配版
 * 运行在 Vercel Runtime，处理图像并请求火山引擎大模型
 */
export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    if (!image) {
      return NextResponse.json({ error: '法相缺失' }, { status: 400 });
    }

    // 环境变量从 Vercel Dashboard 配置
    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const API_KEY = process.env.ARK_API_KEY;
    const ENDPOINT_ID = process.env.ARK_ENDPOINT_ID; 

    if (!API_KEY || !ENDPOINT_ID) {
      console.error("环境变量缺失: 请在 Vercel 中配置 ARK_API_KEY 和 ARK_ENDPOINT_ID");
      return NextResponse.json({ error: '系统配置未就绪，请联系管理员' }, { status: 500 });
    }

    const systemPrompt = `你是一位精通《麻衣神相》、《神相全编》及《柳庄相法》的相学宗师。
现有一缘主求鉴，请观其面相（法相），断其心性。

请严格按照以下 JSON 结构返回分析结果，不要包含任何 Markdown 标记或多余文字：
{
  "score": 数字(0-100),
  "fiveElement": "木/火/土/金/水",
  "elementAnalysis": "五行格局深度解析",
  "palaces": [{"name": "命宫", "status": "优/良/平", "analysis": "解析"}],
  "riskMetrics": [{"label": "执行力", "value": "85%", "traditionalTerm": "乾健", "description": "描述"}],
  "karma": {"past": "前世判词", "present": "今生定位", "future": "未来愿景"},
  "workplace": {"role": "职场角色", "strengths": ["优势1"], "advice": "进阶建议", "compatibility": "契合伙伴说明"},
  "personalityProfile": "一句话性格总括",
  "socialGuide": "社交指南",
  "hobbies": ["建议爱好"],
  "auraStatus": "今日气色",
  "auraMessage": "灵感箴言",
  "moles": [{"position": "位置", "nature": "吉/凶/平", "meaning": "含义"}]
}`;

    const arkResponse = await fetch(ARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: systemPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          }
        ],
        // 强制模型输出 JSON
        response_format: { type: "json_object" }
      })
    });

    if (!arkResponse.ok) {
      const errorText = await arkResponse.text();
      console.error("方舟 API 错误:", errorText);
      return NextResponse.json({ error: '方舟灵鉴暂不可用' }, { status: 502 });
    }

    const data = await arkResponse.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // 确保结果是合法的 JSON
    try {
      const result = JSON.parse(content);
      return NextResponse.json(result);
    } catch (e) {
      console.error("JSON 解析失败:", content);
      return NextResponse.json({ error: '宗师断语格式异常' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("服务端异常:", error);
    return NextResponse.json({ error: '玄机难测，系统处理失败' }, { status: 500 });
  }
}
