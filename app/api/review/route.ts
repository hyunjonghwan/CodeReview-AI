import { streamText } from 'ai';
import { planReview } from '@/lib/ai/client';
import type { UserIntent } from '@/lib/ai/router';

// 스트리밍 리뷰는 모델 응답이 길어질 수 있어 함수 실행 시간을 넉넉히 잡는다.
export const maxDuration = 60;

interface ReviewRequestBody {
  code?: string;
  userIntent?: UserIntent;
}

export async function POST(req: Request) {
  let body: ReviewRequestBody;
  try {
    body = (await req.json()) as ReviewRequestBody;
  } catch {
    return Response.json({ error: '요청 본문이 올바른 JSON이 아닙니다.' }, { status: 400 });
  }

  const code = body.code?.trim();
  if (!code) {
    return Response.json({ error: '리뷰할 코드를 입력하세요.' }, { status: 400 });
  }

  let plan;
  try {
    // 붙여넣기 모드는 단일 파일. GitHub URL(다중 파일)은 Week 6.6a에서 도입.
    plan = planReview({ code, fileCount: 1, userIntent: body.userIntent });
  } catch (err) {
    const message = err instanceof Error ? err.message : '리뷰 라우팅에 실패했습니다.';
    return Response.json({ error: message }, { status: 500 });
  }

  const result = streamText({
    model: plan.model,
    system: plan.systemPrompt,
    prompt: code,
    // 200 헤더는 이미 전송된 뒤라 본문 스트림 중 실패는 서버 로그로만 남는다.
    // (클라이언트는 빈 본문으로 이를 감지한다.)
    onError: ({ error }) => {
      console.error('[api/review] streaming failed:', error);
    },
  });

  // 본문은 리뷰 텍스트(JSON 문자열) 스트림. 라우팅 결정은 헤더로 동봉해 4.7 UI가 사용한다.
  // reason은 한국어라 HTTP 헤더(ASCII)에 직접 넣을 수 없어 인코딩한다.
  return result.toTextStreamResponse({
    headers: {
      'X-Review-Model': plan.decision.model,
      'X-Review-Task': plan.decision.taskType,
      'X-Review-Reason': encodeURIComponent(plan.decision.reason),
    },
  });
}
