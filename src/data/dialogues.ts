export type DialogueContext =
  | 'firstVisit'
  | 'scrolling'
  | 'skills'
  | 'projects'
  | 'contact'
  | 'idle'
  | 'click';

export const dialogues: Record<DialogueContext, string | string[]> = {
  firstVisit: ['欢迎来到我的主页!~', '向下滚动看看吧!'],
  scrolling: '一起去看看下面的内容吧!',
  skills: '这是我的技术栈哦~',
  projects: '这是我的项目作品!',
  contact: '想联系我吗?点下面的图标~',
  idle: '我还在这里等你呢...',
  click: ['嘿!别戳我了,痒痒的~', '你想干嘛呀~', '再戳我就生气了!'],
};

export function getRandomDialogue(context: DialogueContext): string {
  const content = dialogues[context];
  if (Array.isArray(content)) {
    return content[Math.floor(Math.random() * content.length)];
  }
  return content;
}
