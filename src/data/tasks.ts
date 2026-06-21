import { TaskItem, BlindBoxQuestion } from '@/types'

export const generateDailyTasks = (projectId: string, currentDay: number): TaskItem[] => {
  const baseTasks: TaskItem[] = [
    {
      id: 'diet-1',
      title: '拒绝辛辣',
      description: '今天不吃任何辛辣刺激的食物，包括辣椒、花椒、芥末等',
      type: 'diet',
      icon: '🌶️',
      energy: 10,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '可以用葱、姜、蒜（少量）来提味，或者用番茄酱、甜面酱等不辣的酱料'
    },
    {
      id: 'diet-2',
      title: '远离酒精',
      description: '拒绝任何含酒精的饮品，包括啤酒、白酒、红酒等',
      type: 'diet',
      icon: '🍺',
      energy: 10,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '可以用无酒精啤酒、气泡水、鲜榨果汁来代替'
    },
    {
      id: 'diet-3',
      title: '外卖选清淡',
      description: '今天的外卖选择清淡口味，避开重口菜品',
      type: 'diet',
      icon: '🥡',
      energy: 15,
      status: currentDay >= 2 ? 'pending' : 'locked',
      day: 2,
      tips: '推荐：清蒸、白灼、清炒类菜品，避开麻辣、红烧、油炸'
    },
    {
      id: 'diet-4',
      title: '多吃蛋白质',
      description: '今天摄入足够的蛋白质，帮助伤口愈合',
      type: 'diet',
      icon: '🥚',
      energy: 10,
      status: currentDay >= 3 ? 'pending' : 'locked',
      day: 3,
      tips: '鸡蛋、牛奶、瘦肉、鱼虾都是优质蛋白质来源'
    },
    {
      id: 'diet-5',
      title: '多吃水果',
      description: '今天吃至少2种水果，补充维生素',
      type: 'diet',
      icon: '🍎',
      energy: 10,
      status: currentDay >= 4 ? 'pending' : 'locked',
      day: 4,
      tips: '推荐苹果、香蕉、蓝莓、猕猴桃，避开芒果、菠萝等易过敏水果'
    },
    {
      id: 'lifestyle-1',
      title: '早睡早起',
      description: '晚上11点前入睡，保证8小时睡眠',
      type: 'lifestyle',
      icon: '😴',
      energy: 10,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '睡前可以喝杯热牛奶，听轻音乐帮助入睡'
    },
    {
      id: 'lifestyle-2',
      title: '拒绝熬夜',
      description: '晚上10点半前放下手机，准备入睡',
      type: 'lifestyle',
      icon: '🌙',
      energy: 15,
      status: currentDay >= 2 ? 'pending' : 'locked',
      day: 2,
      tips: '可以设置手机定时进入免打扰模式'
    },
    {
      id: 'lifestyle-3',
      title: '适量运动',
      description: '做15分钟轻度运动，如散步、拉伸',
      type: 'lifestyle',
      icon: '🚶',
      energy: 15,
      status: currentDay >= 5 ? 'pending' : 'locked',
      day: 5,
      tips: '避免剧烈运动，可以在家做一些简单的拉伸'
    },
    {
      id: 'lifestyle-4',
      title: '不碰烟酒',
      description: '完全不碰烟酒，包括二手烟',
      type: 'lifestyle',
      icon: '🚭',
      energy: 20,
      status: currentDay >= 3 ? 'pending' : 'locked',
      day: 3,
      tips: '想抽烟的时候可以吃点水果或者嚼无糖口香糖'
    },
    {
      id: 'photo-1',
      title: '今日拍照',
      description: '拍摄恢复情况照片，记录变化',
      type: 'photo',
      icon: '📸',
      energy: 20,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '在相同光线、相同角度下拍摄，便于对比'
    },
    {
      id: 'photo-2',
      title: '肿胀记录',
      description: '评估并记录今天的肿胀程度',
      type: 'photo',
      icon: '📊',
      energy: 15,
      status: currentDay >= 2 ? 'pending' : 'locked',
      day: 2,
      tips: '可以用1-5分来评分，1分最轻，5分最重'
    },
    {
      id: 'photo-3',
      title: '心情记录',
      description: '记录今天的心情和恢复感受',
      type: 'photo',
      icon: '📝',
      energy: 10,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '写下任何想记录的内容，不开心的也可以写下来'
    },
    {
      id: 'custom-1',
      title: '多喝水',
      description: '今天喝够8杯水，促进新陈代谢',
      type: 'custom',
      icon: '💧',
      energy: 5,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '每次少量多次，不要等口渴了才喝'
    },
    {
      id: 'custom-2',
      title: '伤口护理',
      description: '按照医嘱进行伤口清洁和护理',
      type: 'custom',
      icon: '💊',
      energy: 20,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '洗手后再接触伤口，动作要轻柔'
    },
    {
      id: 'custom-3',
      title: '忌海鲜',
      description: '今天不吃任何海鲜产品',
      type: 'diet',
      icon: '🦐',
      energy: 10,
      status: currentDay >= 1 ? 'pending' : 'locked',
      day: 1,
      tips: '想吃海鲜可以用鸡肉、猪肉等代替'
    },
    {
      id: 'custom-4',
      title: '放松心情',
      description: '花10分钟冥想或深呼吸，放松身心',
      type: 'custom',
      icon: '🧘',
      energy: 10,
      status: currentDay >= 4 ? 'pending' : 'locked',
      day: 4,
      tips: '可以找一些冥想音乐来帮助放松'
    }
  ]

  return baseTasks.map(task => ({
    ...task,
    status: task.day < currentDay ? 'completed' : task.day === currentDay ? 'pending' : 'locked'
  }))
}

export const blindBoxQuestions: BlindBoxQuestion[] = [
  {
    id: '1',
    question: '术后以下哪种食物可以吃？',
    options: ['麻辣烫', '鸡蛋羹', '麻辣火锅', '小龙虾'],
    correctIndex: 1,
    explanation: '鸡蛋羹富含蛋白质，易消化，有助于伤口愈合，是术后的理想食物。'
  },
  {
    id: '2',
    question: '术后多久可以喝酒？',
    options: ['第二天就可以', '一周后', '至少2周后', '完全恢复后'],
    correctIndex: 3,
    explanation: '酒精会扩张血管，加重肿胀和淤青，建议完全恢复后再适量饮用。'
  },
  {
    id: '3',
    question: '以下哪种做法是正确的？',
    options: ['用手摸伤口', '伤口沾水', '保持伤口清洁干燥', '戴眼镜压迫鼻梁'],
    correctIndex: 2,
    explanation: '保持伤口清洁干燥是预防感染的关键，不要用手摸或沾水。'
  },
  {
    id: '4',
    question: '术后想吃辣怎么办？',
    options: ['少吃一点没关系', '用不辣的调料代替', '配牛奶一起吃', '配冰饮一起吃'],
    correctIndex: 1,
    explanation: '可以用番茄酱、甜面酱、花生酱等不辣的调料来提味。'
  },
  {
    id: '5',
    question: '以下哪种水果不适合术后吃？',
    options: ['苹果', '香蕉', '芒果', '蓝莓'],
    correctIndex: 2,
    explanation: '芒果属于易过敏水果，术后敏感期建议避免食用。'
  },
  {
    id: '6',
    question: '术后前3天应该怎么睡？',
    options: ['趴着睡', '侧着睡', '垫高枕头仰卧', '怎么舒服怎么睡'],
    correctIndex: 2,
    explanation: '垫高枕头仰卧可以减轻肿胀，避免压迫手术部位。'
  },
  {
    id: '7',
    question: '以下哪种行为有助于消肿？',
    options: ['热敷', '冷敷（48小时后热敷）', '剧烈运动', '喝酒'],
    correctIndex: 1,
    explanation: '术后48小时内冷敷收缩血管，48小时后热敷促进血液循环，都有助于消肿。'
  },
  {
    id: '8',
    question: '术后几天可以正常化妆？',
    options: ['第二天', '一周后', '拆线后3-5天', '一个月后'],
    correctIndex: 2,
    explanation: '建议拆线后3-5天再化妆，避免化妆品刺激伤口。'
  }
]

export const getRandomBlindBoxQuestion = (): BlindBoxQuestion => {
  const randomIndex = Math.floor(Math.random() * blindBoxQuestions.length)
  return blindBoxQuestions[randomIndex]
}
