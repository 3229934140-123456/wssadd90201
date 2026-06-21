import { FoodItem, FoodLevel } from '@/types'

const levelMap: Record<FoodLevel, string> = {
  green: '绿灯',
  yellow: '黄灯',
  red: '红灯'
}

export const foods: FoodItem[] = [
  {
    id: '1',
    name: '麻辣烫',
    level: 'red',
    levelText: '红灯',
    description: '辛辣刺激，含有大量辣椒、花椒等刺激性调料，可能导致伤口发红、肿胀加重，影响恢复。',
    alternatives: ['清汤麻辣烫（不辣）', '蔬菜沙拉', '清粥小菜', '日式豚骨拉面（不辣）'],
    tips: '实在想吃可以选择不辣的骨汤底，只涮蔬菜和清淡的肉类，避免辣椒和花椒。',
    image: 'https://picsum.photos/id/292/300/300',
    category: '川菜'
  },
  {
    id: '2',
    name: '奶茶',
    level: 'yellow',
    levelText: '黄灯',
    description: '含糖量高，奶精可能引起炎症反应。适量饮用无糖或低糖版本问题不大，但建议少喝。',
    alternatives: ['无糖绿茶', '鲜榨果汁', '无糖酸奶', '蜂蜜水'],
    tips: '选择无糖、少冰版本，用鲜奶代替奶精，加珍珠等配料要适量。',
    image: 'https://picsum.photos/id/312/300/300',
    category: '饮品'
  },
  {
    id: '3',
    name: '烧烤',
    level: 'red',
    levelText: '红灯',
    description: '高温烤制产生致癌物质，孜然、辣椒等调料刺激性强，可能导致伤口增生。',
    alternatives: ['清蒸鱼', '白切鸡', '烤蔬菜（无辣）', '煮玉米'],
    tips: '建议完全忌口，实在想吃可以用空气炸锅做无油无辣的版本。',
    image: 'https://picsum.photos/id/326/300/300',
    category: '烧烤'
  },
  {
    id: '4',
    name: '火锅',
    level: 'red',
    levelText: '红灯',
    description: '辛辣汤底和高温食物会刺激血管扩张，加重肿胀，海鲜等食材也容易引起过敏。',
    alternatives: ['番茄锅底火锅', '菌菇锅底', '潮汕牛肉火锅（不辣）', '椰子鸡火锅'],
    tips: '选择清淡锅底，只涮蔬菜和瘦肉，避免海鲜、牛羊肉和辛辣蘸料。',
    image: 'https://picsum.photos/id/401/300/300',
    category: '火锅'
  },
  {
    id: '5',
    name: '小龙虾',
    level: 'red',
    levelText: '红灯',
    description: '海鲜类发物，麻辣小龙虾的调料更是重口，极易引起过敏和炎症反应。',
    alternatives: ['清蒸虾', '白灼基围虾', '虾仁滑蛋', '虾仁粥'],
    tips: '建议完全忌口，尤其是术后前2周。清淡做法的虾可以适量吃。',
    image: 'https://picsum.photos/id/431/300/300',
    category: '海鲜'
  },
  {
    id: '6',
    name: '炸鸡',
    level: 'yellow',
    levelText: '黄灯',
    description: '油腻高热量，油炸食品可能加重炎症反应，建议少吃或选择非油炸版本。',
    alternatives: ['烤鸡胸肉', '空气炸锅鸡米花', '蒸鸡腿', '卤味鸡肉'],
    tips: '去皮，用空气炸锅制作，不沾番茄酱等重口味酱料。',
    image: 'https://picsum.photos/id/570/300/300',
    category: '快餐'
  },
  {
    id: '7',
    name: '咖啡',
    level: 'yellow',
    levelText: '黄灯',
    description: '咖啡因可能影响睡眠和血液循环，适量饮用（每天1杯以内）问题不大。',
    alternatives: ['脱咖啡因咖啡', '燕麦拿铁', '抹茶拿铁', '热巧克力'],
    tips: '选择低因或脱咖啡因版本，加奶不加糖，下午4点后避免饮用。',
    image: 'https://picsum.photos/id/580/300/300',
    category: '饮品'
  },
  {
    id: '8',
    name: '啤酒',
    level: 'red',
    levelText: '红灯',
    description: '酒精会扩张血管，加重肿胀和淤青，还可能影响药物效果。',
    alternatives: ['无酒精啤酒', '气泡水', '果味苏打水', '鲜榨果汁'],
    tips: '建议完全忌口至少2周，社交场合可以用无酒精饮品代替。',
    image: 'https://picsum.photos/id/625/300/300',
    category: '酒水'
  },
  {
    id: '9',
    name: '鸡蛋羹',
    level: 'green',
    levelText: '绿灯',
    description: '高蛋白易消化，营养丰富，有助于伤口愈合，非常适合术后食用。',
    alternatives: ['水煮蛋', '蛋花汤', '豆腐脑', '牛奶蒸蛋'],
    tips: '可以加少量盐和香油调味，不要加酱油、辣椒等刺激性调料。',
    image: 'https://picsum.photos/id/835/300/300',
    category: '家常菜'
  },
  {
    id: '10',
    name: '南瓜粥',
    level: 'green',
    levelText: '绿灯',
    description: '养胃易消化，南瓜含有丰富的维生素A，有助于皮肤修复，还有消肿作用。',
    alternatives: ['小米粥', '山药粥', '莲子粥', '红枣粥'],
    tips: '可以加少量冰糖或蜂蜜调味，不要放太多糖。',
    image: 'https://picsum.photos/id/1080/300/300',
    category: '粥品'
  },
  {
    id: '11',
    name: '清蒸鲈鱼',
    level: 'green',
    levelText: '绿灯',
    description: '优质蛋白，低脂肪，富含DHA，有助于伤口愈合和身体恢复。',
    alternatives: ['清蒸鳕鱼', '三文鱼刺身（适量）', '鲫鱼汤', '鱼头豆腐汤'],
    tips: '蒸的时候放少许姜葱去腥，吃的时候去掉姜葱，不要蘸酱油。',
    image: 'https://picsum.photos/id/292/300/300',
    category: '水产'
  },
  {
    id: '12',
    name: '水果沙拉',
    level: 'green',
    levelText: '绿灯',
    description: '富含维生素C和抗氧化物质，有助于胶原蛋白合成，促进恢复。',
    alternatives: ['鲜榨果汁', '水果拼盘', '酸奶水果捞', '烤苹果'],
    tips: '选择温和的水果如苹果、香蕉、蓝莓，避免芒果、菠萝等易过敏水果。',
    image: 'https://picsum.photos/id/312/300/300',
    category: '轻食'
  },
  {
    id: '13',
    name: '冰淇淋',
    level: 'yellow',
    levelText: '黄灯',
    description: '含糖量高，冰冷刺激，但是适量食用可以帮助消肿（冷敷效果）。',
    alternatives: ['酸奶冰淇淋', '水果冰沙', '冷冻酸奶', '绿豆冰沙'],
    tips: '选择低糖、无巧克力和坚果的原味冰淇淋，小口慢吃。',
    image: 'https://picsum.photos/id/326/300/300',
    category: '甜品'
  },
  {
    id: '14',
    name: '巧克力',
    level: 'yellow',
    levelText: '黄灯',
    description: '含糖量高，可能引发炎症，但黑巧克力（70%以上）适量食用对身体有益。',
    alternatives: ['黑巧克力（70%+）', '可可粉饮品', '枣泥', '坚果'],
    tips: '选择高纯度黑巧克力，每天不超过20克，避开牛奶巧克力和白巧克力。',
    image: 'https://picsum.photos/id/401/300/300',
    category: '甜品'
  },
  {
    id: '15',
    name: '火锅底料',
    level: 'red',
    levelText: '红灯',
    description: '辛辣刺激，含有大量牛油、辣椒、花椒，会严重影响恢复。',
    alternatives: ['番茄底料', '菌菇底料', '清汤底料', '椰子鸡底料'],
    tips: '完全避免麻辣底料，选择清淡养生的锅底。',
    image: 'https://picsum.photos/id/431/300/300',
    category: '调料'
  },
  {
    id: '16',
    name: '牛奶',
    level: 'green',
    levelText: '绿灯',
    description: '富含蛋白质和钙，有助于身体恢复，睡前喝还有助于睡眠。',
    alternatives: ['羊奶', '燕麦奶', '杏仁奶', '无糖酸奶'],
    tips: '选择低脂或脱脂牛奶，乳糖不耐受可以选择舒化奶或酸奶。',
    image: 'https://picsum.photos/id/570/300/300',
    category: '饮品'
  },
  {
    id: '17',
    name: '西兰花',
    level: 'green',
    levelText: '绿灯',
    description: '富含维生素C、维生素K和膳食纤维，抗氧化，有助于伤口愈合。',
    alternatives: ['花椰菜', '菠菜', '芦笋', '甘蓝'],
    tips: '清蒸或白灼，不要用太多油炒，保留营养。',
    image: 'https://picsum.photos/id/580/300/300',
    category: '蔬菜'
  },
  {
    id: '18',
    name: '寿司',
    level: 'yellow',
    levelText: '黄灯',
    description: '生鱼片可能引起过敏或感染，米饭和海苔是安全的，建议选择熟食寿司。',
    alternatives: ['太卷', '黄瓜寿司', '蛋皮寿司', '韩式紫菜包饭'],
    tips: '避开生鱼片、生蚝等生食，选择全熟食材的寿司，不要蘸太多芥末。',
    image: 'https://picsum.photos/id/625/300/300',
    category: '日料'
  }
]

export const searchFoods = (keyword: string): FoodItem[] => {
  if (!keyword) return foods
  const lowerKeyword = keyword.toLowerCase()
  return foods.filter(food => 
    food.name.toLowerCase().includes(lowerKeyword) ||
    food.category.toLowerCase().includes(lowerKeyword) ||
    food.description.toLowerCase().includes(lowerKeyword)
  )
}

export const getFoodById = (id: string): FoodItem | undefined => {
  return foods.find(f => f.id === id)
}

export const getFoodsByLevel = (level: FoodLevel): FoodItem[] => {
  return foods.filter(f => f.level === level)
}

export const hotSearches = ['麻辣烫', '奶茶', '烧烤', '火锅', '小龙虾', '咖啡', '炸鸡', '啤酒', '鸡蛋羹', '南瓜粥']
