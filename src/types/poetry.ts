export type PoeticStyle =
  | '雄浑' | '冲淡' | '绮丽' | '沉郁' | '高古' | '典雅'
  | '洗炼' | '劲健' | '绚烂' | '自然' | '豪放' | '含蓄'
  | '精神' | '缜密' | '疏野' | '清奇' | '委曲' | '实境'
  | '悲慨' | '形容' | '超诣' | '飘逸' | '旷达' | '流动';

export interface PoetryAnalysis {
  title: string;
  author: string;
  dynasty: string;
  style: PoeticStyle;
  style_explanation: string;
  imagery: string;
  analysis: string;
  image_prompt: string;
}

export type FlowStatus =
  | 'idle'
  | 'analyzing'
  | 'generating'
  | 'polling'
  | 'done'
  | 'error';

export interface PoetryFlowState {
  status: FlowStatus;
  analysis: PoetryAnalysis | null;
  imageUrl: string | null;
  taskId: string | null;
  error: string | null;
}
