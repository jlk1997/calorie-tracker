// 初始食物数据库
const initialFoodsDatabase = [
    {
        id: 1,
        name: '米饭',
        calories: 116,
        protein: 2.6,
        fat: 0.3,
        carbs: 25.6,
        perUnit: '100克'
    },
    {
        id: 2,
        name: '鸡胸肉',
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbs: 0,
        perUnit: '100克'
    },
    {
        id: 3,
        name: '三文鱼',
        calories: 208,
        protein: 20,
        fat: 13,
        carbs: 0,
        perUnit: '100克'
    },
    {
        id: 4,
        name: '牛肉',
        calories: 250,
        protein: 26,
        fat: 15,
        carbs: 0,
        perUnit: '100克'
    },
    {
        id: 5,
        name: '鸡蛋',
        calories: 155,
        protein: 13,
        fat: 11,
        carbs: 1.1,
        perUnit: '100克'
    },
    {
        id: 6,
        name: '西兰花',
        calories: 34,
        protein: 2.8,
        fat: 0.4,
        carbs: 6.6,
        perUnit: '100克'
    },
    {
        id: 7,
        name: '牛奶',
        calories: 42,
        protein: 3.4,
        fat: 1,
        carbs: 5,
        perUnit: '100毫升'
    },
    {
        id: 8,
        name: '豆腐',
        calories: 76,
        protein: 8,
        fat: 4.2,
        carbs: 1.9,
        perUnit: '100克'
    },
    {
        id: 9,
        name: '燕麦',
        calories: 389,
        protein: 16.9,
        fat: 6.9,
        carbs: 66.3,
        perUnit: '100克'
    },
    {
        id: 10,
        name: '香蕉',
        calories: 89,
        protein: 1.1,
        fat: 0.3,
        carbs: 22.8,
        perUnit: '100克'
    },
    {
        id: 11,
        name: '苹果',
        calories: 52,
        protein: 0.3,
        fat: 0.2,
        carbs: 13.8,
        perUnit: '100克'
    },
    {
        id: 12,
        name: '全麦面包',
        calories: 247,
        protein: 13,
        fat: 3.2,
        carbs: 41,
        perUnit: '100克'
    },
    {
        id: 13,
        name: '花生酱',
        calories: 588,
        protein: 25,
        fat: 50,
        carbs: 20,
        perUnit: '100克'
    },
    {
        id: 14,
        name: '牛油果',
        calories: 160,
        protein: 2,
        fat: 14.7,
        carbs: 8.5,
        perUnit: '100克'
    },
    {
        id: 15,
        name: '橄榄油',
        calories: 884,
        protein: 0,
        fat: 100,
        carbs: 0,
        perUnit: '100毫升'
    }
];

// 从localStorage获取用户自定义食物，如果没有则使用空数组
const userCustomFoods = JSON.parse(localStorage.getItem('customFoods')) || [];

// 合并初始食物数据和用户自定义食物数据
const foodsDatabase = [...initialFoodsDatabase, ...userCustomFoods];

// 获取最大ID，用于新增食物时生成ID
function getMaxFoodId() {
    return Math.max(...foodsDatabase.map(food => food.id), 0);
}

// 添加新食物到数据库
function addFoodToDatabase(food) {
    // 创建新ID
    const newId = getMaxFoodId() + 1;
    
    // 添加ID和单位
    const newFood = {
        ...food,
        id: newId,
        perUnit: '100克'
    };
    
    // 添加到数据库
    foodsDatabase.push(newFood);
    
    // 更新用户自定义食物
    userCustomFoods.push(newFood);
    
    // 保存到localStorage
    localStorage.setItem('customFoods', JSON.stringify(userCustomFoods));
    
    return newFood;
} 